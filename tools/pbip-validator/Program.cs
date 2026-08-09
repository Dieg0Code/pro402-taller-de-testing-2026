using System.Text.Json;
using System.Text.RegularExpressions;

if (args.Length != 1)
{
    Console.Error.WriteLine("Uso: dotnet run --project tools/pbip-validator -- <archivo.pbip>");
    return 2;
}

var pbipPath = Path.GetFullPath(args[0]);
if (!File.Exists(pbipPath))
{
    Console.Error.WriteLine($"No existe el archivo: {pbipPath}");
    return 2;
}

var root = Path.GetDirectoryName(pbipPath)!;
var errors = new List<string>();
var warnings = new List<string>();

JsonDocument? ReadJson(string file)
{
    try
    {
        return JsonDocument.Parse(File.ReadAllText(file));
    }
    catch (Exception ex)
    {
        errors.Add($"JSON inválido: {Rel(file)} :: {ex.Message}");
        return null;
    }
}

string Rel(string path) => Path.GetRelativePath(root, path);

var pbipJson = ReadJson(pbipPath);
if (pbipJson is null) return Finish();

var reportPath = pbipJson.RootElement
    .GetProperty("artifacts")[0]
    .GetProperty("report")
    .GetProperty("path")
    .GetString();

if (string.IsNullOrWhiteSpace(reportPath))
{
    errors.Add("El .pbip no declara artifact.report.path.");
    return Finish();
}

var reportDir = Path.Combine(root, reportPath);
var modelDir = Path.Combine(root, reportPath.Replace(".Report", ".SemanticModel", StringComparison.OrdinalIgnoreCase));
var reportDefinition = Path.Combine(reportDir, "definition");
var pagesDir = Path.Combine(reportDefinition, "pages");
var tablesDir = Path.Combine(modelDir, "definition", "tables");
var modelFile = Path.Combine(modelDir, "definition", "model.tmdl");
var relationshipsFile = Path.Combine(modelDir, "definition", "relationships.tmdl");

if (!Directory.Exists(reportDir)) errors.Add($"No existe carpeta de reporte: {Rel(reportDir)}");
if (!Directory.Exists(modelDir)) errors.Add($"No existe carpeta de modelo: {Rel(modelDir)}");
if (!Directory.Exists(pagesDir)) errors.Add($"No existe carpeta de páginas: {Rel(pagesDir)}");
if (!Directory.Exists(tablesDir)) errors.Add($"No existe carpeta de tablas: {Rel(tablesDir)}");
if (!File.Exists(modelFile)) errors.Add($"No existe model.tmdl: {Rel(modelFile)}");

foreach (var jsonFile in Directory.EnumerateFiles(root, "*.json", SearchOption.AllDirectories)
             .Concat(Directory.EnumerateFiles(root, "*.pbip", SearchOption.AllDirectories))
             .Concat(Directory.EnumerateFiles(root, "*.pbir", SearchOption.AllDirectories))
             .Concat(Directory.EnumerateFiles(root, "*.pbism", SearchOption.AllDirectories)))
{
    using var _ = ReadJson(jsonFile);
}

var model = LoadModel(tablesDir);
ValidateModelRefs();
ValidateRelationships();
ValidatePages();
ValidateVisualReferences();

return Finish();

Dictionary<string, TableDef> LoadModel(string dir)
{
    var result = new Dictionary<string, TableDef>(StringComparer.OrdinalIgnoreCase);
    if (!Directory.Exists(dir)) return result;

    foreach (var file in Directory.EnumerateFiles(dir, "*.tmdl"))
    {
        var lines = File.ReadAllLines(file);
        var tableLine = lines.FirstOrDefault(l => l.StartsWith("table ", StringComparison.Ordinal));
        if (tableLine is null) continue;
        var tableName = tableLine["table ".Length..].Trim();
        var table = new TableDef(tableName, file);

        foreach (var line in lines)
        {
            var trimmed = line.Trim();
            if (trimmed.StartsWith("column ", StringComparison.Ordinal))
            {
                table.Columns.Add(trimmed["column ".Length..].Trim());
            }
            else if (trimmed.StartsWith("measure ", StringComparison.Ordinal))
            {
                var match = Regex.Match(trimmed, @"measure\s+'([^']+)'");
                if (match.Success) table.Measures.Add(match.Groups[1].Value);
            }
        }

        result[tableName] = table;
    }

    return result;
}

void ValidateModelRefs()
{
    if (!File.Exists(modelFile)) return;
    var refs = File.ReadAllLines(modelFile)
        .Select(l => l.Trim())
        .Where(l => l.StartsWith("ref table ", StringComparison.Ordinal))
        .Select(l => l["ref table ".Length..].Trim())
        .ToList();

    foreach (var table in model.Keys)
    {
        if (!refs.Contains(table, StringComparer.OrdinalIgnoreCase))
            warnings.Add($"Tabla no referenciada en model.tmdl: {table}");
    }

    foreach (var reference in refs)
    {
        if (!model.ContainsKey(reference))
            errors.Add($"model.tmdl referencia tabla inexistente: {reference}");
    }
}

void ValidateRelationships()
{
    if (!File.Exists(relationshipsFile)) return;
    var relationships = LoadRelationships();

    foreach (var relationship in relationships)
    {
        if (!Regex.IsMatch(relationship.Id, @"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"))
            errors.Add($"Relación con identificador no GUID: {relationship.Id}");

        ValidateColumnPath(relationship.FromColumn, $"Relación {relationship.Id} fromColumn");
        ValidateColumnPath(relationship.ToColumn, $"Relación {relationship.Id} toColumn");
    }

    ValidateAmbiguousRelationshipPaths(relationships);
}

List<RelationshipDef> LoadRelationships()
{
    var result = new List<RelationshipDef>();
    RelationshipDef? current = null;

    foreach (var line in File.ReadAllLines(relationshipsFile))
    {
        var trimmed = line.Trim();
        if (trimmed.StartsWith("relationship ", StringComparison.Ordinal))
        {
            if (current is not null) result.Add(current);
            current = new RelationshipDef(trimmed["relationship ".Length..].Trim());
            continue;
        }

        if (current is null) continue;
        if (trimmed.StartsWith("fromColumn: ", StringComparison.Ordinal))
            current.FromColumn = trimmed.Split(": ", 2)[1].Trim();
        else if (trimmed.StartsWith("toColumn: ", StringComparison.Ordinal))
            current.ToColumn = trimmed.Split(": ", 2)[1].Trim();
    }

    if (current is not null) result.Add(current);
    return result;
}

void ValidateAmbiguousRelationshipPaths(List<RelationshipDef> relationships)
{
    var edges = relationships
        .Where(r => !string.IsNullOrWhiteSpace(r.FromColumn) && !string.IsNullOrWhiteSpace(r.ToColumn))
        .Select(r => new RelationshipEdge(
            r.Id,
            TableFromColumnPath(r.FromColumn),
            TableFromColumnPath(r.ToColumn)))
        .Where(e => !string.Equals(e.FromTable, e.ToTable, StringComparison.OrdinalIgnoreCase))
        .ToList();

    foreach (var edge in edges)
    {
        var alternatePath = FindPath(edges.Where(e => e.Id != edge.Id), edge.FromTable, edge.ToTable);
        if (alternatePath.Count == 0) continue;

        errors.Add(
            $"Ruta ambigua entre '{edge.FromTable}' y '{edge.ToTable}': " +
            $"{edge.FromTable}->{edge.ToTable} y {string.Join("->", alternatePath)}");
    }
}

List<string> FindPath(IEnumerable<RelationshipEdge> edges, string start, string target)
{
    var graph = new Dictionary<string, HashSet<string>>(StringComparer.OrdinalIgnoreCase);
    foreach (var edge in edges)
    {
        if (!graph.TryGetValue(edge.FromTable, out var fromSet))
            graph[edge.FromTable] = fromSet = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        if (!graph.TryGetValue(edge.ToTable, out var toSet))
            graph[edge.ToTable] = toSet = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        fromSet.Add(edge.ToTable);
        toSet.Add(edge.FromTable);
    }

    var queue = new Queue<List<string>>();
    var visited = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { start };
    queue.Enqueue(new List<string> { start });

    while (queue.Count > 0)
    {
        var path = queue.Dequeue();
        var current = path[^1];
        if (!graph.TryGetValue(current, out var nextTables)) continue;

        foreach (var next in nextTables)
        {
            if (!visited.Add(next)) continue;
            var nextPath = path.Concat(new[] { next }).ToList();
            if (string.Equals(next, target, StringComparison.OrdinalIgnoreCase))
                return nextPath;
            queue.Enqueue(nextPath);
        }
    }

    return new List<string>();
}

string TableFromColumnPath(string value)
{
    var dot = value.IndexOf('.');
    return dot <= 0 ? value : value[..dot];
}

void ValidateColumnPath(string value, string context)
{
    var dot = value.IndexOf('.');
    if (dot <= 0)
    {
        errors.Add($"{context}: ruta de columna inválida '{value}'");
        return;
    }

    var table = value[..dot];
    var column = value[(dot + 1)..];
    if (!model.TryGetValue(table, out var tableDef))
    {
        errors.Add($"{context}: tabla inexistente '{table}'");
        return;
    }

    if (!tableDef.Columns.Contains(column, StringComparer.OrdinalIgnoreCase))
        errors.Add($"{context}: columna inexistente '{table}.{column}'");
}

void ValidatePages()
{
    var pagesJsonPath = Path.Combine(pagesDir, "pages.json");
    var pagesJson = ReadJson(pagesJsonPath);
    if (pagesJson is null) return;

    var pageOrder = pagesJson.RootElement.GetProperty("pageOrder").EnumerateArray()
        .Select(e => e.GetString()!)
        .ToList();

    foreach (var page in pageOrder)
    {
        var pageJson = Path.Combine(pagesDir, page, "page.json");
        if (!File.Exists(pageJson))
            errors.Add($"pages.json referencia página sin page.json: {page}");
    }

    foreach (var dir in Directory.EnumerateDirectories(pagesDir))
    {
        var name = Path.GetFileName(dir);
        if (name != "pages.json" && !pageOrder.Contains(name))
            warnings.Add($"Carpeta de página no listada en pages.json: {name}");
    }
}

void ValidateVisualReferences()
{
    if (!Directory.Exists(pagesDir)) return;
    foreach (var visualFile in Directory.EnumerateFiles(pagesDir, "visual.json", SearchOption.AllDirectories))
    {
        var json = ReadJson(visualFile);
        if (json is null) continue;
        var text = File.ReadAllText(visualFile);

        foreach (Match match in Regex.Matches(text, @"""Entity""\s*:\s*""([^""]+)""[\s\S]{0,240}?""Property""\s*:\s*""([^""]+)"""))
        {
            var entity = match.Groups[1].Value;
            var property = match.Groups[2].Value;
            if (!model.TryGetValue(entity, out var table))
            {
                errors.Add($"{Rel(visualFile)} referencia entidad inexistente: {entity}");
                continue;
            }

            if (!table.Columns.Contains(property, StringComparer.OrdinalIgnoreCase) &&
                !table.Measures.Contains(property, StringComparer.OrdinalIgnoreCase))
            {
                errors.Add($"{Rel(visualFile)} referencia campo inexistente: {entity}.{property}");
            }
        }
    }
}

int Finish()
{
    foreach (var warning in warnings.Distinct()) Console.WriteLine($"WARN: {warning}");
    foreach (var error in errors.Distinct()) Console.WriteLine($"ERROR: {error}");

    if (errors.Count == 0)
    {
        Console.WriteLine($"PBIP válido estructuralmente: {pbipPath}");
        Console.WriteLine($"Warnings: {warnings.Distinct().Count()}");
        return 0;
    }

    Console.WriteLine($"PBIP inválido: {errors.Distinct().Count()} error(es), {warnings.Distinct().Count()} warning(s)");
    return 1;
}

record TableDef(string Name, string File)
{
    public HashSet<string> Columns { get; } = new(StringComparer.OrdinalIgnoreCase);
    public HashSet<string> Measures { get; } = new(StringComparer.OrdinalIgnoreCase);
}

record RelationshipDef(string Id)
{
    public string FromColumn { get; set; } = "";
    public string ToColumn { get; set; } = "";
}

record RelationshipEdge(string Id, string FromTable, string ToTable);
