using System;
using System.Linq;
using System.IO;
using DocumentFormat.OpenXml.Validation;
using DocumentFormat.OpenXml.Packaging;

/**
 * PPTX Structural Validator (AIEP)
 * Esta herramienta valida la integridad del XML generado por PptxGenJS utilizando el SDK de OpenXML.
 * Detecta dimensiones negativas, ceros absolutos ilegales y estructuras corruptas.
 */
class Program {
    static int Main(string[] args) {
        if (args.Length == 0) {
            Console.WriteLine("Uso: dotnet run -- <ruta_al_archivo.pptx>");
            return 1;
        }

        string filePath = args[0];
        if (!File.Exists(filePath)) {
            Console.WriteLine($"Error: El archivo no existe en {filePath}");
            return 1;
        }

        try {
            using (PresentationDocument doc = PresentationDocument.Open(filePath, false)) {
                OpenXmlValidator validator = new OpenXmlValidator();
                var errors = validator.Validate(doc);

                // Filtramos errores de metadatos conocidos que PowerPoint ignora
                var criticalErrors = errors.Where(e => 
                    !e.Description.Contains("notesMasterIdLst") && 
                    !e.Description.Contains("handoutMasterIdLst")
                ).ToList();

                if (!criticalErrors.Any()) {
                    Console.WriteLine("✅ PPTX VALIDADO: La estructura es íntegra y compatible con PowerPoint.");
                    return 0;
                } else {
                    Console.WriteLine($"❌ SE ENCONTRARON {criticalErrors.Count} ERRORES ESTRUCTURALES:");
                    foreach (var error in criticalErrors) {
                        Console.WriteLine($"---");
                        Console.WriteLine($"Descripción: {error.Description}");
                        Console.WriteLine($"Ubicación: {error.Part?.Uri}");
                        Console.WriteLine($"XPath: {error.Path?.XPath}");
                    }
                    return 1;
                }
            }
        } catch (Exception ex) {
            Console.WriteLine($"💥 ERROR FATAL: No se pudo abrir el archivo. Posible corrupción severa: {ex.Message}");
            return 1;
        }
    }
}
