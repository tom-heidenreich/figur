// AI-generated
import { ArgProp, SemanticCallTag } from "@eagleoutice/flowr/dataflow/environments/built-in-props";
import { BuiltInProcName } from "@eagleoutice/flowr/dataflow/environments/built-in-proc-name";
import type { BuiltInDefinition } from "@eagleoutice/flowr/dataflow/environments/built-in-config";

// flowR doesn't model unzip/untar, so it doesn't know they create files and a later
// list.files(exdir) doesn't depend on them: the slicer drops the extraction.
// Describe them like download.file: they read the archive and write into exdir
export const archiveBuiltIns: BuiltInDefinition[] = [
  {
    type: "function",
    names: [["unzip", "utils"]],
    processor: BuiltInProcName.DefaultReadAllArgs,
    config: {
      tags: [SemanticCallTag.File, SemanticCallTag.Reads, SemanticCallTag.Writes],
      sig: [
        ["zipfile", ArgProp.Forced | ArgProp.Resource],
        ["files", ArgProp.Forced | ArgProp.Value],
        ["list", ArgProp.Forced | ArgProp.Flag],
        ["overwrite", ArgProp.Forced | ArgProp.Flag],
        ["junkpaths", ArgProp.Forced | ArgProp.Flag],
        ["exdir", ArgProp.Forced | ArgProp.Resource],
      ],
    },
    assumePrimitive: false,
  },
  {
    type: "function",
    names: [["untar", "utils"]],
    processor: BuiltInProcName.DefaultReadAllArgs,
    config: {
      tags: [SemanticCallTag.File, SemanticCallTag.Reads, SemanticCallTag.Writes],
      sig: [
        ["tarfile", ArgProp.Forced | ArgProp.Resource],
        ["files", ArgProp.Forced | ArgProp.Value],
        ["list", ArgProp.Forced | ArgProp.Flag],
        ["exdir", ArgProp.Forced | ArgProp.Resource],
      ],
    },
    assumePrimitive: false,
  },
];
