/* ========================================================================================================
 * extension.js - gnome shell extension
 * --------------------------------------------------------------------------------------------------------
 *  CREDITS:  This code was copied from the dash-to-dock extension https://github.com/micheleg/dash-to-dock
 *  and modified to create a workspaces dock. Many thanks to michele_g for a great extension.
 * ========================================================================================================
 */

const _DEBUG_ = false;

const Main = imports.ui.main;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const St = imports.gi.St;

const Config = imports.misc.config;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;
const Intellihide = Me.imports.intellihide;
const DockedWorkspaces = Me.imports.dockedWorkspaces;
const GSVersion = Config.PACKAGE_VERSION.split('.');

const Gettext = imports.gettext.domain(Me.metadata['gettext-domain']);
const _ = Gettext.gettext;

let settings;
let intellihide;
let dock;
let workspacesToDockStylesheet = null;

function loadStylesheet() {
    if (_DEBUG_) global.log("WorkspacesToDock: _loadStylesheet");
    // Get css filename
    let filename = "workspaces-to-dock.css";
    if (GSVersion[1] < 6)
        filename = "workspaces-to-dock-gs34.css";

    // Get current theme stylesheet
    let themeStylesheet = Main._defaultCssStylesheet;
    if (Main._cssStylesheet != null)
        themeStylesheet = Main._cssStylesheet;

    // Get theme directory
    let themeDirectory = GLib.path_get_dirname(themeStylesheet);

    // Test for workspacesToDock stylesheet
    workspacesToDockStylesheet = themeDirectory + '/extensions/workspaces-to-dock/' + filename;
    if (!GLib.file_test(workspacesToDockStylesheet, GLib.FileTest.EXISTS)) {
        if (_DEBUG_) global.log("Theme doesn't support workspacesToDock .. use default stylesheet");
        let defaultStylesheet = Gio.File.new_for_path(Me.path + "/themes/default/" + filename);
        if (defaultStylesheet.query_exists(null)) {
            workspacesToDockStylesheet = defaultStylesheet.get_path();
        } else {
            throw new Error(_("No Workspaces-To-Dock stylesheet found") + " (extension.js).");
        }
    }

    let themeContext = St.ThemeContext.get_for_stage(global.stage);
    if (!themeContext)
        return false;

    let theme = themeContext.get_theme();
    if (!theme)
        return false;

    // Load workspacesToDock stylesheet
    theme.load_stylesheet(workspacesToDockStylesheet);
    return true;
}

function unloadStylesheet() {
    if (_DEBUG_) global.log("WorkspacesToDock: _unloadStylesheet");
    let themeContext = St.ThemeContext.get_for_stage(global.stage);
    if (!themeContext)
        return false;

    let theme = themeContext.get_theme();
    if (!theme)
        return false;

    // Unload workspacesToDock stylesheet
    if (workspacesToDockStylesheet)
        theme.unload_stylesheet(workspacesToDockStylesheet);

    workspacesToDockStylesheet = null;
    return true;
}

function init() {
    Convenience.initTranslations();
}

function enable() {
    if (_DEBUG_) global.log("workspaces-to-dock: ENABLE");
    loadStylesheet();
    settings = Convenience.getSettings('org.gnome.shell.extensions.workspaces-to-dock');
    dock = new DockedWorkspaces.dockedWorkspaces(settings, GSVersion);
    intellihide = new Intellihide.intellihide(dock, settings, GSVersion);
}

function disable() {
    if (_DEBUG_) global.log("workspaces-to-dock: DISABLE");
    unloadStylesheet();
    intellihide.destroy();
    dock.destroy();
    settings.run_dispose();

    dock = null;
    intellihide = null;
    settings = null;
}

