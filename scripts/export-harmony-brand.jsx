#target illustrator

(function () {
  var priorInteraction = app.userInteractionLevel;
  app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

  var scriptFile = new File($.fileName);
  var root = scriptFile.parent.parent;
  var sourceDir = new Folder(root.fsName + "/tmp/harmony-balaton-villa/source-svg");
  var outputDir = new Folder(root.fsName + "/output/harmony-balaton-villa");
  var logDir = new Folder(root.fsName + "/tmp/harmony-balaton-villa");
  var logFile = new File(logDir.fsName + "/illustrator-export.log");
  var statusFile = new File(logDir.fsName + "/illustrator-export-status.txt");

  function ensureFolder(folder) {
    if (!folder.exists && !folder.create()) {
      throw new Error("Could not create folder: " + folder.fsName);
    }
  }

  ensureFolder(outputDir);
  ensureFolder(logDir);

  var aiDir = new Folder(outputDir.fsName + "/vectors/AI");
  var svgDir = new Folder(outputDir.fsName + "/vectors/SVG");
  var epsDir = new Folder(outputDir.fsName + "/vectors/EPS");
  var pdfDir = new Folder(outputDir.fsName + "/vectors/PDF");
  var pngTransparentDir = new Folder(outputDir.fsName + "/png/transparent");
  var pngApplicationDir = new Folder(outputDir.fsName + "/png/applications");
  var masterDir = new Folder(outputDir.fsName + "/master");
  var faviconDir = new Folder(outputDir.fsName + "/favicon");

  ensureFolder(aiDir);
  ensureFolder(svgDir);
  ensureFolder(epsDir);
  ensureFolder(pdfDir);
  ensureFolder(pngTransparentDir);
  ensureFolder(pngApplicationDir);
  ensureFolder(masterDir);
  ensureFolder(faviconDir);

  logFile.open("w");
  function log(message) {
    logFile.writeln(new Date().toUTCString() + "  " + message);
  }

  function safeName(name, fallback) {
    if (!name || name === "") return fallback;
    return name.replace(/_/g, " ");
  }

  function outlineAllText(doc) {
    var count = 0;
    var guard = 0;
    while (doc.textFrames.length > 0 && guard < 2000) {
      var textFrame = doc.textFrames[doc.textFrames.length - 1];
      var parentName = "";
      try {
        if (textFrame.parent && textFrame.parent.name) parentName = textFrame.parent.name;
      } catch (ignoreParent) {}
      var outlined = textFrame.createOutline();
      outlined.name = parentName ? parentName + " Outlines" : "Outlined Typography " + (count + 1);
      count += 1;
      guard += 1;
    }
    if (doc.textFrames.length > 0) {
      throw new Error("Text outlining guard exceeded in " + doc.name);
    }
    return count;
  }

  function directItems(container) {
    var items = [];
    var all = container.pageItems;
    for (var i = 0; i < all.length; i += 1) {
      if (all[i].parent === container) items.push(all[i]);
    }
    return items;
  }

  function promoteArtworkToLayers(doc) {
    if (doc.layers.length < 1) return;
    var base = doc.layers[0];
    var top = directItems(base);

    if (top.length === 1 && top[0].typename === "GroupItem" && top[0].pageItems.length > 1) {
      var wrapper = top[0];
      var wrapperChildren = directItems(wrapper);
      if (wrapperChildren.length > 1 && (!wrapper.name || wrapper.name === "" || wrapper.name === "Layer 1")) {
        for (var u = wrapperChildren.length - 1; u >= 0; u -= 1) {
          wrapperChildren[u].move(base, ElementPlacement.PLACEATBEGINNING);
        }
        wrapper.remove();
        top = directItems(base);
      }
    }

    if (top.length === 0) {
      base.name = "01 Artwork";
      return;
    }

    var promoted = [];
    for (var i = top.length - 1; i >= 0; i -= 1) {
      var item = top[i];
      var layer = doc.layers.add();
      layer.name = safeName(item.name, ("Artwork " + (top.length - i)));
      item.move(layer, ElementPlacement.PLACEATBEGINNING);
      promoted.push(layer);
    }

    try {
      base.remove();
    } catch (ignoreBase) {
      base.name = "00 Source Container";
    }

    for (var p = 0; p < promoted.length; p += 1) {
      if (/background/i.test(promoted[p].name)) {
        try { promoted[p].zOrder(ZOrderMethod.SENDTOBACK); } catch (ignoreOrder) {}
      }
    }
  }

  function assertPureVector(doc) {
    if (doc.textFrames.length !== 0) throw new Error("Live text remains in " + doc.name);
    if (doc.rasterItems.length !== 0) throw new Error("Raster items found in " + doc.name);
    if (doc.placedItems.length !== 0) throw new Error("Linked items found in " + doc.name);
  }

  function saveAI(doc, file) {
    var options = new IllustratorSaveOptions();
    options.pdfCompatible = true;
    options.compressed = true;
    options.embedICCProfile = true;
    doc.saveAs(file, options);
  }

  function savePDF(doc, file) {
    var options = new PDFSaveOptions();
    options.preserveEditability = true;
    options.generateThumbnails = true;
    options.viewAfterSaving = false;
    try { options.acrobatLayers = true; } catch (ignoreLayers) {}
    doc.saveAs(file, options);
  }

  function saveEPS(doc, file) {
    var options = new EPSSaveOptions();
    options.embedAllFonts = true;
    options.includeDocumentThumbnails = true;
    try { options.compatibleGradientPrinting = false; } catch (ignoreGradient) {}
    doc.saveAs(file, options);
  }

  function exportSVG(doc, file) {
    var options = new ExportOptionsSVG();
    options.coordinatePrecision = 4;
    options.embedRasterImages = true;
    options.preserveEditability = true;
    options.responsive = false;
    try { options.cssProperties = SVGCSSPropertyLocation.PRESENTATIONATTRIBUTES; } catch (ignoreCSS) {}
    doc.exportFile(file, ExportType.SVG, options);
  }

  function exportPNG(doc, file, scale) {
    var options = new ExportOptionsPNG24();
    options.antiAliasing = true;
    options.transparency = true;
    options.artBoardClipping = true;
    options.horizontalScale = scale || 100;
    options.verticalScale = scale || 100;
    doc.exportFile(file, ExportType.PNG24, options);
  }

  var assets = [
    { source: "primary-horizontal.svg", out: "Harmony_Balaton_Villa_Primary_Horizontal", transparent: true },
    { source: "stacked.svg", out: "Harmony_Balaton_Villa_Stacked", transparent: true },
    { source: "monogram.svg", out: "Harmony_Balaton_Villa_Monogram", transparent: true },
    { source: "primary-horizontal-black.svg", out: "Harmony_Balaton_Villa_OneColor_Black", transparent: true },
    { source: "primary-horizontal-white.svg", out: "Harmony_Balaton_Villa_OneColor_White", transparent: true },
    { source: "light-application.svg", out: "Harmony_Balaton_Villa_Light_Application", transparent: false },
    { source: "dark-application.svg", out: "Harmony_Balaton_Villa_Dark_Application", transparent: false },
    { source: "favicon.svg", out: "Harmony_Balaton_Villa_Favicon", transparent: false, favicon: true },
    { source: "social-profile.svg", out: "Harmony_Balaton_Villa_Social_Profile", transparent: false },
    { source: "identity-board.svg", out: "Harmony_Balaton_Villa_Identity_Master", transparent: false, master: true },
  ];

  var completed = [];
  try {
    for (var a = 0; a < assets.length; a += 1) {
      var spec = assets[a];
      var sourceFile = new File(sourceDir.fsName + "/" + spec.source);
      if (!sourceFile.exists) throw new Error("Missing source SVG: " + sourceFile.fsName);

      log("Opening " + sourceFile.fsName);
      var doc = app.open(sourceFile);
      var outlinedCount = outlineAllText(doc);
      promoteArtworkToLayers(doc);
      assertPureVector(doc);

      var aiFile = spec.master
        ? new File(masterDir.fsName + "/" + spec.out + ".ai")
        : new File(aiDir.fsName + "/" + spec.out + ".ai");
      var svgFile = spec.master
        ? new File(masterDir.fsName + "/" + spec.out + ".svg")
        : new File(svgDir.fsName + "/" + spec.out + ".svg");
      var epsFile = spec.master
        ? new File(masterDir.fsName + "/" + spec.out + ".eps")
        : new File(epsDir.fsName + "/" + spec.out + ".eps");
      var pdfFile = spec.master
        ? new File(masterDir.fsName + "/" + spec.out + ".pdf")
        : new File(pdfDir.fsName + "/" + spec.out + ".pdf");

      var pngTargetFolder = spec.transparent ? pngTransparentDir : pngApplicationDir;
      if (spec.favicon) pngTargetFolder = faviconDir;
      var pngFile = new File(pngTargetFolder.fsName + "/" + spec.out + ".png");

      saveAI(doc, aiFile);
      exportSVG(doc, svgFile);
      exportPNG(doc, pngFile, 100);
      savePDF(doc, pdfFile);
      saveEPS(doc, epsFile);

      completed.push(spec.out);
      log("Exported " + spec.out + " with " + outlinedCount + " outlined text object(s) and " + doc.layers.length + " layer(s)");
      doc.close(SaveOptions.DONOTSAVECHANGES);
    }

    statusFile.open("w");
    statusFile.write("SUCCESS\n" + completed.join("\n"));
    statusFile.close();
    log("SUCCESS: " + completed.length + " assets exported");
  } catch (error) {
    try {
      if (app.documents.length > 0) app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    } catch (ignoreClose) {}
    statusFile.open("w");
    statusFile.write("ERROR\n" + error.message + "\n" + error.line);
    statusFile.close();
    log("ERROR: " + error.message + " at line " + error.line);
    throw error;
  } finally {
    logFile.close();
    app.userInteractionLevel = priorInteraction;
  }
}());
