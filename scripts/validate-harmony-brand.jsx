#target illustrator

(function () {
  var priorInteraction = app.userInteractionLevel;
  app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

  var scriptFile = new File($.fileName);
  var root = scriptFile.parent.parent;
  var outputDir = new Folder(root.fsName + "/output/harmony-balaton-villa");
  var reportFile = new File(root.fsName + "/tmp/harmony-balaton-villa/illustrator-validation.txt");
  var folders = [
    new Folder(outputDir.fsName + "/vectors/AI"),
    new Folder(outputDir.fsName + "/vectors/SVG"),
    new Folder(outputDir.fsName + "/vectors/EPS"),
    new Folder(outputDir.fsName + "/vectors/PDF"),
    new Folder(outputDir.fsName + "/master"),
  ];
  var allowed = /\.(ai|svg|eps|pdf)$/i;
  var files = [];
  var errors = [];
  var records = [];

  for (var f = 0; f < folders.length; f += 1) {
    var candidates = folders[f].getFiles();
    for (var c = 0; c < candidates.length; c += 1) {
      if (candidates[c] instanceof File && allowed.test(candidates[c].name)) files.push(candidates[c]);
    }
  }

  function inspectFile(file) {
    var doc = app.open(file);
    var issue = [];
    var gradientFills = 0;
    var gradientStrokes = 0;

    if (doc.textFrames.length !== 0) issue.push("live-text=" + doc.textFrames.length);
    if (doc.rasterItems.length !== 0) issue.push("raster=" + doc.rasterItems.length);
    if (doc.placedItems.length !== 0) issue.push("linked=" + doc.placedItems.length);
    if (doc.pathItems.length === 0 && doc.compoundPathItems.length === 0) issue.push("no-vector-paths");

    for (var p = 0; p < doc.pathItems.length; p += 1) {
      var pathItem = doc.pathItems[p];
      try {
        if (pathItem.filled && pathItem.fillColor.typename === "GradientColor") gradientFills += 1;
      } catch (ignoreFill) {}
      try {
        if (pathItem.stroked && pathItem.strokeColor.typename === "GradientColor") gradientStrokes += 1;
      } catch (ignoreStroke) {}
    }
    if (gradientFills > 0) issue.push("gradient-fills=" + gradientFills);
    if (gradientStrokes > 0) issue.push("gradient-strokes=" + gradientStrokes);

    var record = [
      issue.length === 0 ? "PASS" : "FAIL",
      file.fsName,
      "layers=" + doc.layers.length,
      "paths=" + doc.pathItems.length,
      "compoundPaths=" + doc.compoundPathItems.length,
      "text=" + doc.textFrames.length,
      "raster=" + doc.rasterItems.length,
      "linked=" + doc.placedItems.length,
    ].join(" | ");
    if (issue.length > 0) record += " | " + issue.join(",");
    records.push(record);
    if (issue.length > 0) errors.push(file.name + ": " + issue.join(", "));
    doc.close(SaveOptions.DONOTSAVECHANGES);
  }

  try {
    for (var i = 0; i < files.length; i += 1) inspectFile(files[i]);
  } catch (error) {
    errors.push("Validator exception: " + error.message + " at line " + error.line);
    try {
      if (app.documents.length > 0) app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    } catch (ignoreClose) {}
  }

  reportFile.open("w");
  reportFile.writeln(errors.length === 0 ? "SUCCESS" : "ERROR");
  reportFile.writeln("files=" + files.length);
  reportFile.writeln("errors=" + errors.length);
  reportFile.writeln("");
  for (var r = 0; r < records.length; r += 1) reportFile.writeln(records[r]);
  if (errors.length > 0) {
    reportFile.writeln("");
    for (var e = 0; e < errors.length; e += 1) reportFile.writeln(errors[e]);
  }
  reportFile.close();
  app.userInteractionLevel = priorInteraction;

  if (errors.length > 0) throw new Error("Harmony brand validation failed. See " + reportFile.fsName);
}());
