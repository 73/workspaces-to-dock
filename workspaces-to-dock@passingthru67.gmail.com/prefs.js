/* ========================================================================================================
 * prefs.js - preferences
 * --------------------------------------------------------------------------------------------------------
 *  CREDITS:  This code was copied from the dash-to-dock extension https://github.com/micheleg/dash-to-dock
 *  and modified to create a workspaces dock. Many thanks to michele_g for a great extension.
 * ========================================================================================================
 */

const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

const Gettext = imports.gettext.domain(Me.metadata['gettext-domain']);
const _ = Gettext.gettext;


const WorkspacesToDockPreferencesWidget = new GObject.Class({
    Name: 'workspacesToDock.WorkspacesToDockPreferencesWidget',
    GTypeName: 'WorkspacesToDockPreferencesWidget',
    Extends: Gtk.Box,

    _init: function(params) {
        let self = this;
        this.parent(params);
        this.settings = Convenience.getSettings('org.gnome.shell.extensions.workspaces-to-dock');
        this._rtl = Gtk.Widget.get_default_direction() == Gtk.TextDirection.RTL;

        let notebook = new Gtk.Notebook();


        /* ================================================*/
        /* NOTEBOOK - BEHAVIOR SETTINGS PAGE */
        /* ------------------------------------------------*/

        let notebookBehaviorSettings = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            margin_left: 10,
            margin_right: 10
        });

        let notebookBehaviorSettingsTitle = new Gtk.Label({
            label: _("Behavior"),
            use_markup: true,
            xalign: 0,
            margin_top: 5,
            margin_bottom: 5,
        });


        /* TITLE: VISIBILITY SETTINGS */

        let visibilityTitle = new Gtk.Label({
            label: _("<b>Visibility</b>"),
            use_markup: true,
            xalign: 0,
            margin_top: 15,
            margin_bottom: 5
        });

        /* ALWAYS VISIBLE WIDGETS */

        let alwaysVisibleLabel = new Gtk.Label({
            label: _("Dock is fixed and always visible"),
            use_markup: true,
            xalign: 0,
            hexpand: true
        });

        let alwaysVisibleSwitch = new Gtk.Switch ({
            halign: Gtk.Align.END
        });
        alwaysVisibleSwitch.set_active(this.settings.get_boolean('dock-fixed'));
        alwaysVisibleSwitch.connect("notify::active", Lang.bind(this, function(check) {
            this.settings.set_boolean('dock-fixed', check.get_active());
        }));

        /* Add to layout */
        let visibilityControlGrid = new Gtk.Grid({
            row_homogeneous: false,
            column_homogeneous: false
        });
        let visibilityContainerBox = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            spacing: 0,
            homogeneous: false,
            margin_left: 10,
            margin_top: 10,
            margin_bottom: 10,
            margin_right: 10
        });
        visibilityControlGrid.attach(alwaysVisibleLabel, 0, 0, 1, 1);
        visibilityControlGrid.attach(alwaysVisibleSwitch, 1, 0, 1, 1);

        /* Bind interactions */
        this.settings.bind('dock-fixed', visibilityContainerBox, 'sensitive', Gio.SettingsBindFlags.INVERT_BOOLEAN);


        /* TIMING WIDGETS */

        let animationTimeLabel = new Gtk.Label({
            label: _("Animation time [ms]"),
            use_markup: true,
            xalign: 0,
            hexpand: true,
            margin_top: 0
        });

        let animationTimeSpinner = new Gtk.SpinButton({
            halign: Gtk.Align.END,
            margin_top: 0
        });
        animationTimeSpinner.set_sensitive(true);
        animationTimeSpinner.set_range(0, 5000);
        animationTimeSpinner.set_value(this.settings.get_double("animation-time") * 1000);
        animationTimeSpinner.set_increments(50, 100);
        animationTimeSpinner.connect("value-changed", Lang.bind(this, function(button) {
            let s = button.get_value_as_int() / 1000;
            this.settings.set_double("animation-time", s);
        }));

        let showDelayLabel = new Gtk.Label({
            label: _("Show delay [ms]"),
            use_markup: true,
            xalign: 0,
            hexpand: true
        });

        let showDelaySpinner = new Gtk.SpinButton({
            halign: Gtk.Align.END
        });
        showDelaySpinner.set_sensitive(true);
        showDelaySpinner.set_range(0, 5000);
        showDelaySpinner.set_value(this.settings.get_double("show-delay") * 1000);
        showDelaySpinner.set_increments(50, 100);
        showDelaySpinner.connect("value-changed", Lang.bind(this, function(button) {
            let s = button.get_value_as_int() / 1000;
            this.settings.set_double("show-delay", s);
        }));

        let hideDelayLabel = new Gtk.Label({
            label: _("Hide delay [ms]"),
            use_markup: true,
            xalign: 0,
            hexpand: true
        });

        let hideDelaySpinner = new Gtk.SpinButton({
            halign: Gtk.Align.END
        });
        hideDelaySpinner.set_sensitive(true);
        hideDelaySpinner.set_range(0, 5000);
        hideDelaySpinner.set_value(this.settings.get_double("hide-delay") * 1000);
        hideDelaySpinner.set_increments(50, 100);
        hideDelaySpinner.connect("value-changed", Lang.bind(this, function(button) {
            let s = button.get_value_as_int() / 1000;
            this.settings.set_double("hide-delay", s);
        }));

        let leaveVisibleButton = new Gtk.CheckButton({
            label: _("Leave the dock edge visible when slid out"),
            margin_left: 0,
            margin_top: 4
        });
        leaveVisibleButton.set_active(this.settings.get_boolean('dock-edge-visible'));
        leaveVisibleButton.connect('toggled', Lang.bind(this, function(check) {
            this.settings.set_boolean('dock-edge-visible', check.get_active());
        }));

        /* Add to layout */
        let timingGrid = new Gtk.Grid({
            row_homogeneous: false,
            column_homogeneous: false,
            margin_top: 5
        });
        timingGrid.attach(animationTimeLabel, 0, 0, 1, 1);
        timingGrid.attach(animationTimeSpinner, 1, 0, 1, 1);
        timingGrid.attach(showDelayLabel, 0, 1, 1, 1);
        timingGrid.attach(showDelaySpinner, 1, 1, 1, 1);
        timingGrid.attach(hideDelayLabel, 0, 2, 1, 1);
        timingGrid.attach(hideDelaySpinner, 1, 2, 1, 1);
        timingGrid.attach(leaveVisibleButton, 0, 3, 2, 1);
        visibilityContainerBox.add(timingGrid);


        /* AUTOHIDE WIDGETS */

        let autohideLabel = new Gtk.Label({
            label: _("Autohide : Show the dock on mouse hover"),
            use_markup: true,
            xalign: 0,
            hexpand: true,
            margin_top: 0
        });

        let autohideSwitch = new Gtk.Switch ({
            halign: Gtk.Align.END,
            margin_top: 0
        });
        autohideSwitch.set_active(this.settings.get_boolean('autohide'));
        autohideSwitch.connect("notify::active", Lang.bind(this, function(check) {
            this.settings.set_boolean('autohide', check.get_active());
        }));

        let requireClickButton = new Gtk.CheckButton({
            label: _("Require click to show the dock when window maximized"),
            margin_left: 0,
            margin_top: 0
        });
        requireClickButton.set_active(this.settings.get_boolean('require-click-to-show'));
        requireClickButton.connect('toggled', Lang.bind(this, function(check) {
            this.settings.set_boolean('require-click-to-show', check.get_active());
        }));

        let requirePressureButton = new Gtk.CheckButton({
            label: _("Require pressure to show the dock (GS3.8+)"),
            margin_left: 0,
            margin_top: 0
        });
        requirePressureButton.set_active(this.settings.get_boolean('require-pressure-to-show'));
        requirePressureButton.connect('toggled', Lang.bind(this, function(check) {
            this.settings.set_boolean('require-pressure-to-show', check.get_active());
        }));

        let pressureThresholdLabel = new Gtk.Label({
            label: _("Pressure threshold [px] (GS3.8+)"),
            use_markup: true,
            xalign: 0,
            margin_top: 0,
            hexpand: true
        });

        let pressureThresholdSpinner = new Gtk.SpinButton({
            halign: Gtk.Align.END,
            margin_top: 0
        });
        pressureThresholdSpinner.set_sensitive(true);
        pressureThresholdSpinner.set_range(10, 1000);
        pressureThresholdSpinner.set_value(this.settings.get_double("pressure-threshold") * 1);
        pressureThresholdSpinner.set_increments(10, 20);
        pressureThresholdSpinner.connect("value-changed", Lang.bind(this, function(button) {
            let s = button.get_value_as_int() / 1;
            this.settings.set_double("pressure-threshold", s);
        }));

        /* Add to layout */
        let autohideControlGrid = new Gtk.Grid({
            row_homogeneous: false,
            column_homogeneous: false,
            margin_top: 15
        });
        let autohideContainerGrid = new Gtk.Grid({
            row_homogeneous: false,
            column_homogeneous: false
        });
        autohideControlGrid.attach(autohideLabel, 0, 0, 1, 1);
        autohideControlGrid.attach(autohideSwitch, 1, 0, 1, 1);
        autohideContainerGrid.attach(requireClickButton, 0, 0, 2, 1);
        autohideContainerGrid.attach(requirePressureButton, 0, 1, 2, 1);
        autohideContainerGrid.attach(pressureThresholdLabel, 0, 2, 1, 1);
        autohideContainerGrid.attach(pressureThresholdSpinner, 1, 2, 1, 1);
        visibilityContainerBox.add(autohideControlGrid);
        visibilityContainerBox.add(autohideContainerGrid);

        /* Bind interactions */
        this.settings.bind('autohide', autohideContainerGrid, 'sensitive', Gio.SettingsBindFlags.DEFAULT);


        /* INTELLIHIDE WIDGETS */

        let intellihideLabel = new Gtk.Label({
            label: _("Intellihide : Show the dock unless a window overlaps"),
            use_markup: true,
            xalign: 0,
            hexpand: true,
            margin_top: 5
        });

        let intellihideSwitch = new Gtk.Switch ({
            halign: Gtk.Align.END,
            margin_top: 5
        });
        intellihideSwitch.set_active(this.settings.get_boolean('intellihide'));
        intellihideSwitch.connect("notify::active", Lang.bind(this, function(check) {
            this.settings.set_boolean('intellihide', check.get_active());
        }));

        let intellihideNormal =  new Gtk.RadioButton({
            label: _("Dodge all windows"),
            margin_top: 0
        });
        intellihideNormal.connect('toggled', Lang.bind(this, function(check){
            if (check.get_active()) this.settings.set_int('intellihide-option', 0);
        }));

        let intellihideFocusApp =  new Gtk.RadioButton({
            label: _("Dodge all instances of focused app"),
            group: intellihideNormal,
            margin_top: 0
        });
        intellihideFocusApp.connect('toggled', Lang.bind(this, function(check){
            if (check.get_active()) this.settings.set_int('intellihide-option', 1);
        }));

        let intellihideTopWindow =  new Gtk.RadioButton({
            label: _("Dodge only top instance of focused app"),
            group: intellihideNormal,
            margin_top: 0
        });
        intellihideTopWindow.connect('toggled', Lang.bind(this, function(check){
            if (check.get_active()) this.settings.set_int('intellihide-option', 2);
        }));

        let intellihideOption = this.settings.get_int('intellihide-option');
        switch (intellihideOption) {
            case 0:
                intellihideNormal.set_active(true); // any window .. normal mode
                break;
            case 1:
                intellihideFocusApp.set_active(true); // focused application windows mode
                break;
            case 2:
                intellihideTopWindow.set_active(true); // top focused application window mode
                break;
            default:
                intellihideNormal.set_active(true); // default .. any window
        }

        /* Add to layout */
        let intellihideControlGrid = new Gtk.Grid({
            row_homogeneous: false,
            column_homogeneous: false,
            margin_top: 15
        });
        let intellihideContainerGrid = new Gtk.Grid({
            row_homogeneous: false,
            column_homogeneous: false
        });
        intellihideControlGrid.attach(intellihideLabel, 0, 0, 1, 1);
        intellihideControlGrid.attach(intellihideSwitch, 1, 0, 1, 1);
        intellihideContainerGrid.attach(intellihideNormal, 0, 0, 2, 1);
        intellihideContainerGrid.attach(intellihideFocusApp, 0, 1, 2, 1);
        intellihideContainerGrid.attach(intellihideTopWindow, 0, 2, 2, 1);
        visibilityContainerBox.add(intellihideControlGrid);
        visibilityContainerBox.add(intellihideContainerGrid);
        
        /* Bind interactions */
        this.settings.bind('intellihide', intellihideContainerGrid, 'sensitive', Gio.SettingsBindFlags.DEFAULT);


        /* KEYBOARD SHORCUT WIDGETS */

        let toggleDockShortcutLabel = new Gtk.Label({
            label: _("Toggle the dock with a keyboard shortcut"),
            use_markup: true,
            xalign: 0,
            hexpand: false
        });

        let toggleDockShortcutEntry = new Gtk.Entry({
            margin_top: 2,
            margin_left: 20,
            margin_right: 10,
            halign: Gtk.Align.END
        });
        toggleDockShortcutEntry.set_width_chars(15);
        toggleDockShortcutEntry.set_text(this.settings.get_strv('dock-keyboard-shortcut')[0]);
        toggleDockShortcutEntry.connect('changed', Lang.bind(this, function(entry) {
            let [key, mods] = Gtk.accelerator_parse(entry.get_text());
            if(Gtk.accelerator_valid(key, mods)) {
                toggleDockShortcutEntry["secondary-icon-name"] = null;
                toggleDockShortcutEntry["secondary-icon-tooltip-text"] = null;
                let shortcut = Gtk.accelerator_name(key, mods);
                this.settings.set_strv('dock-keyboard-shortcut', [shortcut]);
            } else {
                toggleDockShortcutEntry["secondary-icon-name"] = "dialog-warning-symbolic";
                toggleDockShortcutEntry["secondary-icon-tooltip-text"] = _("Invalid accelerator. Try F12, <Super>space, <Ctrl><Alt><Shift>w, etc.");
            }
        }));

        let toggleDockShortcutSwitch = new Gtk.Switch ({
            halign: Gtk.Align.END,
            hexpand: true
        });
        toggleDockShortcutSwitch.set_active(this.settings.get_boolean('toggle-dock-with-keyboard-shortcut'));
        toggleDockShortcutSwitch.connect('notify::active', Lang.bind(this, function(check) {
            this.settings.set_boolean('toggle-dock-with-keyboard-shortcut', check.get_active());
        }));

        /* Add to layout */
        let keyboardShortcutsControlGrid = new Gtk.Grid({
            row_homogeneous: false,
            column_homogeneous: false,
            margin_top: 15,
            margin_left: 0,
            margin_bottom: 20
        });
        keyboardShortcutsControlGrid.attach(toggleDockShortcutLabel, 0, 0, 1, 1);
        keyboardShortcutsControlGrid.attach(toggleDockShortcutEntry, 1, 0, 1, 1);
        keyboardShortcutsControlGrid.attach(toggleDockShortcutSwitch, 2, 0, 1, 1);
        visibilityContainerBox.add(keyboardShortcutsControlGrid);
        
        /* Bind interactions */
        this.settings.bind('toggle-dock-with-keyboard-shortcut', toggleDockShortcutEntry, 'sensitive', Gio.SettingsBindFlags.DEFAULT);



        /* ADD TO NOTEBOOK PAGE */
        notebookBehaviorSettings.add(visibilityTitle);
        notebookBehaviorSettings.add(visibilityControlGrid);
        notebookBehaviorSettings.add(visibilityContainerBox);
        notebook.append_page(notebookBehaviorSettings, notebookBehaviorSettingsTitle);



        /* ================================================*/
        /* NOTEBOOK - APPEARANCE SETTINGS PAGE */
        /* ------------------------------------------------*/

        let notebookAppearanceSettings = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            margin_left: 10,
            margin_right: 10
        });

        let notebookAppearanceSettingsTitle = new Gtk.Label({
            label: _("Appearance"),
            use_markup: true,
            xalign: 0,
            margin_top: 5,
            margin_bottom: 5,
        });


        /* TITLE: BACKGROUND SETTINGS */

        let backgroundTitle = new Gtk.Label({
            label: _("<b>Background</b>"),
            use_markup: true,
            xalign: 0,
            margin_top: 15,
            margin_bottom: 5
        });


        /* OPAQUE LAYER WIDGETS */

        let opaqueLayerLabel = new Gtk.Label({
            label: _("Customize the dock background opacity"),
            xalign: 0,
            hexpand: true
        });

        let opaqueLayerSwitch = new Gtk.Switch ({
            halign: Gtk.Align.END
        });
        opaqueLayerSwitch.set_active(this.settings.get_boolean('opaque-background'));
        opaqueLayerSwitch.connect('notify::active', Lang.bind(this, function(check) {
            this.settings.set_boolean('opaque-background', check.get_active());
        }));

        let layerOpacityLabel = new Gtk.Label({
            label: _("Opacity"),
            use_markup: true,
            xalign: 0,
        });

        let layerOpacityScaler = new Gtk.Scale({
            orientation: Gtk.Orientation.HORIZONTAL,
            valuePos: Gtk.PositionType.RIGHT,
            margin_left: 20
        });
        layerOpacityScaler.set_range(0, 100);
        layerOpacityScaler.set_value(this.settings.get_double('background-opacity') * 100);
        layerOpacityScaler.set_digits(0);
        layerOpacityScaler.set_increments(5, 5);
        layerOpacityScaler.set_size_request(200, -1);
        layerOpacityScaler.connect('value-changed', Lang.bind(this, function(button) {
            let s = button.get_value() / 100;
            this.settings.set_double('background-opacity', s);
        }));

        let opaqueLayeralwaysVisibleButton = new Gtk.CheckButton({
            label: _("Only when the dock is shown by autohide"),
            margin_left: 0
        });
        opaqueLayeralwaysVisibleButton.set_active(!this.settings.get_boolean('opaque-background-always'));
        opaqueLayeralwaysVisibleButton.connect('toggled', Lang.bind(this, function(check) {
            this.settings.set_boolean('opaque-background-always', !check.get_active());
        }));

        /* Add to layout */
        let backgroundControlGrid = new Gtk.Grid({
            row_homogeneous: false,
            column_homogeneous: false,
            margin_left: 0
        });
        let backgroundContainerGrid = new Gtk.Grid({
            row_homogeneous: false,
            column_homogeneous: false,
            margin_left: 10
        });
        backgroundControlGrid.attach(opaqueLayerLabel, 0, 0, 1, 1);
        backgroundControlGrid.attach(opaqueLayerSwitch, 1, 0, 1, 1);
        backgroundContainerGrid.attach(layerOpacityLabel, 0, 0, 1, 1);
        backgroundContainerGrid.attach(layerOpacityScaler, 1, 0, 1, 1);
        backgroundContainerGrid.attach(opaqueLayeralwaysVisibleButton, 0, 1, 2, 1);

        /* Bind interactions */
        this.settings.bind('opaque-background', backgroundContainerGrid, 'sensitive', Gio.SettingsBindFlags.DEFAULT);


        /* TITLE: POSITION SETTINGS */

        let dockPositionTitle = new Gtk.Label({
            label: _("<b>Position</b>"),
            use_markup: true,
            xalign: 0,
            margin_top: 25,
            margin_bottom: 5
        });


        /* MONITOR WIDGETS */

        let dockMonitorLabel = new Gtk.Label({label: _("Show the dock on the following monitor (if attached)"), hexpand:true, xalign:0});
        let dockMonitorCombo = new Gtk.ComboBoxText({halign:Gtk.Align.END});
            dockMonitorCombo.append_text(_('Primary (default)'));
            dockMonitorCombo.append_text(_('1'));
            dockMonitorCombo.append_text(_('2'));
            dockMonitorCombo.append_text(_('3'));
            dockMonitorCombo.append_text(_('4'));

        let active = this.settings.get_int('preferred-monitor');
        if (active<0)
            active = 0;
        dockMonitorCombo.set_active(active);
        dockMonitorCombo.connect('changed', Lang.bind (this, function(widget) {
            let active = widget.get_active();
            if (active <=0)
                this.settings.set_int('preferred-monitor', -1);
            else
                this.settings.set_int('preferred-monitor', active );
        }));

        /* Add to layout */
        let dockMonitorControlGrid = new Gtk.Grid({
            row_homogeneous: false,
            column_homogeneous: false,
            margin_top: 0,
            margin_left: 0
        });
        dockMonitorControlGrid.attach(dockMonitorLabel, 0, 0, 1, 1);
        dockMonitorControlGrid.attach(dockMonitorCombo, 1, 0, 1, 1);


        /* TITLE: SIZE SETTINGS */

        let dockHeightTitle = new Gtk.Label({
            label: _("<b>Height</b>"),
            use_markup: true,
            xalign: 0,
            margin_top: 25,
            margin_bottom: 5
        });


        /* HEIGHT WIDGETS */

        let extendHeightLabel = new Gtk.Label({
            label: _("Extend the height of the dock to fill the screen"),
            xalign: 0,
            hexpand: true
        });

        let extendHeightSwitch = new Gtk.Switch ({
            halign: Gtk.Align.END
        });
        extendHeightSwitch.set_active(this.settings.get_boolean('extend-height'));
        extendHeightSwitch.connect('notify::active', Lang.bind(this, function(check) {
            this.settings.set_boolean('extend-height', check.get_active());
        }));

        let topMarginLabel = new Gtk.Label({
            label: _("Top margin"),
            use_markup: true,
            xalign: 0,
            hexpand: true
        });

        let topMargin = new Gtk.SpinButton();
        topMargin.set_range(0, 15);
        topMargin.set_value(this.settings.get_double('top-margin') * 100);
        topMargin.set_digits(1);
        topMargin.set_increments(.5, 1);
        topMargin.set_size_request(120, -1);
        topMargin.connect('value-changed', Lang.bind(this, function(button) {
            let s = button.get_value() / 100;
            this.settings.set_double('top-margin', s);
        }));
        topMargin.connect('output', function(button, data) {
            var val = button.get_value().toFixed(1);
            button.set_text(val + "%");
            return true;
        });

        let bottomMarginLabel = new Gtk.Label({
            label: _("Bottom margin"),
            use_markup: true,
            xalign: 0,
            hexpand: true
        });

        let bottomMargin = new Gtk.SpinButton();
        bottomMargin.set_range(0, 15);
        bottomMargin.set_value(this.settings.get_double('bottom-margin') * 100);
        bottomMargin.set_digits(1);
        bottomMargin.set_increments(.5, 1);
        bottomMargin.set_size_request(120, -1);
        bottomMargin.connect('value-changed', Lang.bind(this, function(button) {
            let s = button.get_value() / 100;
            this.settings.set_double('bottom-margin', s);
        }));
        bottomMargin.connect('output', function(button, data) {
            var val = button.get_value().toFixed(1);
            button.set_text(val + "%");
            return true;
        });

        /* Add to layout */
        let dockHeightControlGrid = new Gtk.Grid({
            row_homogeneous: false,
            column_homogeneous: false,
            margin_top: 0,
            margin_left: 0
        });
        let dockHeightContainerGrid = new Gtk.Grid({
            row_homogeneous: false,
            column_homogeneous: false,
            margin_top: 0,
            margin_left: 10
        });
        dockHeightControlGrid.attach(extendHeightLabel, 0, 0, 1, 1);
        dockHeightControlGrid.attach(extendHeightSwitch, 1, 0, 1, 1);
        dockHeightContainerGrid.attach(topMarginLabel, 0, 0, 1, 1);
        dockHeightContainerGrid.attach(topMargin, 1, 0, 1, 1);
        dockHeightContainerGrid.attach(bottomMarginLabel, 0, 1, 1, 1);
        dockHeightContainerGrid.attach(bottomMargin, 1, 1, 1, 1);

        /* Bind interactions */
        this.settings.bind('extend-height', dockHeightContainerGrid, 'sensitive', Gio.SettingsBindFlags.DEFAULT);


        /* ADD TO NOTEBOOK PAGE */
        notebookAppearanceSettings.add(backgroundTitle);
        notebookAppearanceSettings.add(backgroundControlGrid);
        notebookAppearanceSettings.add(backgroundContainerGrid);
        notebookAppearanceSettings.add(dockPositionTitle);
        notebookAppearanceSettings.add(dockMonitorControlGrid);
        notebookAppearanceSettings.add(dockHeightTitle);
        notebookAppearanceSettings.add(dockHeightControlGrid);
        notebookAppearanceSettings.add(dockHeightContainerGrid);
        notebook.append_page(notebookAppearanceSettings, notebookAppearanceSettingsTitle);



        /* ================================================*/
        /* NOTEBOOK - ADDITIONAL SETTINGS PAGE */
        /* ------------------------------------------------*/
        let notebookAdditionalSettings = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            margin_left: 10,
            margin_right: 10
        });

        let notebookAdditionalSettingsTitle = new Gtk.Label({
            label: _("Additional"),
            use_markup: true,
            xalign: 0,
            margin_top: 5,
            margin_bottom: 5,
        });


        /* TITLE: WORKSPACE CAPTION SETTINGS*/

        let workspaceCaptionsTitle = new Gtk.Label({
            label: _("<b>Workspace Captions</b>"),
            use_markup: true,
            xalign: 0,
            margin_top: 15,
            margin_bottom: 5
        });

        let icon_previous, icon_next;
        if (this._rtl) {
            icon_previous = "go-next";
            icon_next = "go-previous";
        } else {
            icon_previous = "go-previous";
            icon_next = "go-next";
        }


        /* WORKSPACE CAPTION WIDGETS */

        let workspaceCaptionsLabel = new Gtk.Label({
            label: _("Add captions to workspace thumbnails"),
            xalign: 0,
            hexpand: true,
            margin_left: 0
        });

        let workspaceCaptionsSwitch = new Gtk.Switch ({
            halign: Gtk.Align.END
        });
        workspaceCaptionsSwitch.set_active(this.settings.get_boolean('workspace-captions'));
        workspaceCaptionsSwitch.connect('notify::active', Lang.bind(this, function(check) {
            this.settings.set_boolean('workspace-captions', check.get_active());
        }));

        // Workspace Captions - User Theme Support
        let wsCaptionThemeSupport =  new Gtk.CheckButton({
            label: _("User theme supports workspaces-to-dock captions"),
            hexpand: true
        });
        wsCaptionThemeSupport.set_active(this.settings.get_boolean('workspace-captions-support'));
        wsCaptionThemeSupport.connect('toggled', Lang.bind(this, function(check){
            this.settings.set_boolean('workspace-captions-support', check.get_active());
        }));

        // Workspace Captions - Number
        let wsCaptionNumberButton =  new Gtk.CheckButton({
            label: _("Show workspace number"),
            hexpand: true
        });
        wsCaptionNumberButton.set_active(this._getItemExists('number'));
        wsCaptionNumberButton.connect('toggled', Lang.bind(this, function(check){
            if (check.get_active()) {
                this._addItem('number', wsCaptionNumberExpand.get_active());
            } else {
                this._removeItem('number');
            }
        }));
        let wsCaptionNumberExpand =  new Gtk.CheckButton({
            label: _("Expand"),
            hexpand: true
        });

        wsCaptionNumberExpand.set_active(this._getItemExpanded('number'));
        wsCaptionNumberExpand.connect('toggled', Lang.bind(this, function(check){
            this._setItemExpanded('number', check.get_active());
        }));

        let wsCaptionNumber_MoveLeftButton = new Gtk.Button({
            image: new Gtk.Image({
                icon_name: icon_previous
            })
        });
        wsCaptionNumber_MoveLeftButton.connect('clicked', function(){
            self._moveItem('number', 1);
        });
        let wsCaptionNumber_MoveRightButton = new Gtk.Button({
            image: new Gtk.Image({
                icon_name: icon_next
            })
        });
        wsCaptionNumber_MoveRightButton.connect('clicked', function(){
            self._moveItem('number', -1);
        });

        // Workspace Captions - Name
        let wsCaptionNameButton =  new Gtk.CheckButton({
            label: _("Show workspace name"),
            hexpand: true
        });
        wsCaptionNameButton.set_active(this._getItemExists('name'));
        wsCaptionNameButton.connect('toggled', Lang.bind(this, function(check){
            if (check.get_active()) {
                this._addItem('name', wsCaptionNameExpand.get_active());
            } else {
                this._removeItem('name');
            }
        }));

        let wsCaptionNameExpand =  new Gtk.CheckButton({
            label: _("Expand"),
            hexpand: true
        });
        wsCaptionNameExpand.set_active(this._getItemExpanded('name'));
        wsCaptionNameExpand.connect('toggled', Lang.bind(this, function(check){
            this._setItemExpanded('name', check.get_active());
        }));

        let wsCaptionName_MoveLeftButton = new Gtk.Button({
            image: new Gtk.Image({
                icon_name: icon_previous
            })
        });
        wsCaptionName_MoveLeftButton.connect('clicked', function(){
            self._moveItem('name', 1);
        });
        let wsCaptionName_MoveRightButton = new Gtk.Button({
            image: new Gtk.Image({
                icon_name: icon_next
            })
        });
        wsCaptionName_MoveRightButton.connect('clicked', function(){
            self._moveItem('name', -1);
        });

        // Workspace Captions - Window Count
        let wsCaptionWindowCount =  new Gtk.CheckButton({
            label: _("Show workspace window count"),
            hexpand: true
        });

        wsCaptionWindowCount.set_active(this._getItemExists('windowcount'));
        wsCaptionWindowCount.connect('toggled', Lang.bind(this, function(check){
            if (check.get_active()) {
                this._addItem('windowcount', wsCaptionWindowCountExpand.get_active());
            } else {
                this._removeItem('windowcount');
            }
        }));

        let wsCaptionWindowCountUseImage =  new Gtk.CheckButton({
            label: _("Use image"),
            hexpand: true
        });
        wsCaptionWindowCountUseImage.set_active(this.settings.get_boolean('workspace-caption-windowcount-image'));
        wsCaptionWindowCountUseImage.connect('toggled', Lang.bind(this, function(check) {
            this.settings.set_boolean('workspace-caption-windowcount-image', check.get_active());
        }));

        let wsCaptionWindowCountExpand =  new Gtk.CheckButton({
            label: _("Expand"),
            hexpand: true
        });

        wsCaptionWindowCountExpand.set_active(this._getItemExpanded('windowcount'));
        wsCaptionWindowCountExpand.connect('toggled', Lang.bind(this, function(check){
            this._setItemExpanded('windowcount', check.get_active());
        }));

        let wsCaptionWindowCount_MoveLeftButton = new Gtk.Button({
            image: new Gtk.Image({
                icon_name: icon_previous
            })
        });
        wsCaptionWindowCount_MoveLeftButton.connect('clicked', function(){
            self._moveItem('windowcount', 1);
        });
        let wsCaptionWindowCount_MoveRightButton = new Gtk.Button({
            image: new Gtk.Image({
                icon_name: icon_next
            })
        });
        wsCaptionWindowCount_MoveRightButton.connect('clicked', function(){
            self._moveItem('windowcount', -1);
        });

        // Workspace Captions - Window Apps (taskbar)
        let wsCaptionWindowApps =  new Gtk.CheckButton({
            label: _("Show workspace taskbar (apps)"),
            hexpand: true
        });
        wsCaptionWindowApps.set_active(this._getItemExists('windowapps'));
        wsCaptionWindowApps.connect('toggled', Lang.bind(this, function(check){
            if (check.get_active()) {
                this._addItem('windowapps', wsCaptionWindowAppsExpand.get_active());
            } else {
                this._removeItem('windowapps');
            }
        }));

        let wsCaptionWindowAppsUseLargeIcons =  new Gtk.CheckButton({
            label: _("Large icons"),
            hexpand: true
        });
        wsCaptionWindowAppsUseLargeIcons.set_active(this.settings.get_boolean('workspace-caption-large-icons'));
        wsCaptionWindowAppsUseLargeIcons.connect('toggled', Lang.bind(this, function(check) {
            this.settings.set_boolean('workspace-caption-large-icons', check.get_active());
        }));

        let wsCaptionWindowAppsExpand =  new Gtk.CheckButton({
            label: _("Expand"),
            hexpand: true
        });
        wsCaptionWindowAppsExpand.set_active(this._getItemExpanded('windowapps'));
        wsCaptionWindowAppsExpand.connect('toggled', Lang.bind(this, function(check){
            this._setItemExpanded('windowapps', check.get_active());
        }));

        let wsCaptionWindowApps_MoveLeftButton = new Gtk.Button({
            image: new Gtk.Image({
                icon_name: icon_previous
            })
        });
        wsCaptionWindowApps_MoveLeftButton.connect('clicked', function(){
            self._moveItem('windowapps', 1);
        });
        let wsCaptionWindowApps_MoveRightButton = new Gtk.Button({
            image: new Gtk.Image({
                icon_name: icon_next
            })
        });
        wsCaptionWindowApps_MoveRightButton.connect('clicked', function(){
            self._moveItem('windowapps', -1);
        });

        // Workspace Captions - Spacer
        let wsCaptionSpacer =  new Gtk.CheckButton({
            label: _("Show a spacer/filler"),
            hexpand: true
        });

        wsCaptionSpacer.set_active(this._getItemExists('spacer'));
        wsCaptionSpacer.connect('toggled', Lang.bind(this, function(check){
            if (check.get_active()) {
                this._addItem('spacer', wsCaptionSpacerExpand.get_active());
            } else {
                this._removeItem('spacer');
            }
        }));

        let wsCaptionSpacerExpand =  new Gtk.CheckButton({
            label: _("Expand"),
            hexpand: true
        });

        wsCaptionSpacerExpand.set_active(this._getItemExpanded('spacer'));
        wsCaptionSpacerExpand.connect('toggled', Lang.bind(this, function(check){
            this._setItemExpanded('spacer', check.get_active());
        }));

        let wsCaptionSpacer_MoveLeftButton = new Gtk.Button({
            image: new Gtk.Image({
                icon_name: icon_previous
            })
        });
        wsCaptionSpacer_MoveLeftButton.connect('clicked', function(){
            self._moveItem('spacer', 1);
        });
        let wsCaptionSpacer_MoveRightButton = new Gtk.Button({
            image: new Gtk.Image({
                icon_name: icon_next
            })
        });
        wsCaptionSpacer_MoveRightButton.connect('clicked', function(){
            self._moveItem('spacer', -1);
        });

        /* Add to layout */
        let workspaceCaptionsControlGrid = new Gtk.Grid({
            row_homogeneous: false,
            column_homogeneous: false,
            margin_top: 0,
            margin_left: 0
        });
        let workspaceCaptionsContainerGrid = new Gtk.Grid({
            row_homogeneous: false,
            column_homogeneous: false,
            margin_top: 0,
            margin_left: 10
        });

        workspaceCaptionsControlGrid.attach(workspaceCaptionsLabel, 0, 0, 1, 1);
        workspaceCaptionsControlGrid.attach(workspaceCaptionsSwitch, 1, 0, 1, 1);
        

        workspaceCaptionsContainerGrid.attach(wsCaptionThemeSupport, 0, 0, 2, 1);

        workspaceCaptionsContainerGrid.attach(wsCaptionNumberButton, 0, 1, 1, 1);
        workspaceCaptionsContainerGrid.attach(wsCaptionNumberExpand, 2, 1, 1, 1);
        workspaceCaptionsContainerGrid.attach(wsCaptionNumber_MoveLeftButton, 3, 1, 1, 1);
        workspaceCaptionsContainerGrid.attach(wsCaptionNumber_MoveRightButton, 4, 1, 1, 1);

        workspaceCaptionsContainerGrid.attach(wsCaptionNameButton, 0, 2, 1, 1);
        workspaceCaptionsContainerGrid.attach(wsCaptionNameExpand, 2, 2, 1, 1);
        workspaceCaptionsContainerGrid.attach(wsCaptionName_MoveLeftButton, 3, 2, 1, 1);
        workspaceCaptionsContainerGrid.attach(wsCaptionName_MoveRightButton, 4, 2, 1, 1);

        workspaceCaptionsContainerGrid.attach(wsCaptionWindowCount, 0, 3, 1, 1);
        workspaceCaptionsContainerGrid.attach(wsCaptionWindowCountUseImage, 1, 3, 1, 1);
        workspaceCaptionsContainerGrid.attach(wsCaptionWindowCountExpand, 2, 3, 1, 1);
        workspaceCaptionsContainerGrid.attach(wsCaptionWindowCount_MoveLeftButton, 3, 3, 1, 1);
        workspaceCaptionsContainerGrid.attach(wsCaptionWindowCount_MoveRightButton, 4, 3, 1, 1);

        workspaceCaptionsContainerGrid.attach(wsCaptionWindowApps, 0, 4, 1, 1);
        workspaceCaptionsContainerGrid.attach(wsCaptionWindowAppsUseLargeIcons, 1, 4, 1, 1);
        workspaceCaptionsContainerGrid.attach(wsCaptionWindowAppsExpand, 2, 4, 1, 1);
        workspaceCaptionsContainerGrid.attach(wsCaptionWindowApps_MoveLeftButton, 3, 4, 1, 1);
        workspaceCaptionsContainerGrid.attach(wsCaptionWindowApps_MoveRightButton, 4, 4, 1, 1);

        workspaceCaptionsContainerGrid.attach(wsCaptionSpacer, 0, 5, 1, 1);
        workspaceCaptionsContainerGrid.attach(wsCaptionSpacerExpand, 2, 5, 1, 1);
        workspaceCaptionsContainerGrid.attach(wsCaptionSpacer_MoveLeftButton, 3, 5, 1, 1);
        workspaceCaptionsContainerGrid.attach(wsCaptionSpacer_MoveRightButton, 4, 5, 1, 1);

        /* Bind interactions */
        this.settings.bind('workspace-captions', workspaceCaptionsContainerGrid, 'sensitive', Gio.SettingsBindFlags.DEFAULT);


        /* TITLE: CUSTOM ACTIONS SETTINGS */

        let customActionsTitle = new Gtk.Label({
            label: _("<b>Custom Actions</b>"),
            use_markup: true,
            xalign: 0,
            margin_top: 25,
            margin_bottom: 5
        });


        /* TOGGLE OVERVIEW WIDGETS */
        let toggleOverviewLabel = new Gtk.Label({
            label: _("Toggle Gnome Shell's overview mode with right click"),
            xalign: 0,
            hexpand: true
        });

        let toggleOverviewSwitch = new Gtk.Switch ({
            halign: Gtk.Align.END
        });
        toggleOverviewSwitch.set_active(this.settings.get_boolean('toggle-overview'));
        toggleOverviewSwitch.connect('notify::active', Lang.bind(this, function(check) {
            this.settings.set_boolean('toggle-overview', check.get_active());
        }));

        /* Add to layout */
        let customActionsControlGrid = new Gtk.Grid({
            row_homogeneous: false,
            column_homogeneous: false,
            margin_top: 0,
            margin_left: 0
        });
        customActionsControlGrid.attach(toggleOverviewLabel, 0, 0, 1, 1);
        customActionsControlGrid.attach(toggleOverviewSwitch, 1, 0, 1, 1);


        /* TITLE: DASH INTEGRATION SETTINGS */

        let dashIntegrationTitle = new Gtk.Label({
            label: _("<b>Dash Integration</b>"),
            use_markup: true,
            xalign: 0,
            margin_top: 25,
            margin_bottom: 5
        });


        /* DASH-TO-DOCK WIDGETS*/

        let dashToDockHoverLabel = new Gtk.Label({
            label: _("Show the dock when hovering over Dash-To-Dock extension"),
            xalign: 0,
            hexpand: true
        });

        let dashToDockHoverSwitch = new Gtk.Switch ({
            halign: Gtk.Align.END
        });
        dashToDockHoverSwitch.set_active(this.settings.get_boolean('dashtodock-hover'));
        dashToDockHoverSwitch.connect('notify::active', Lang.bind(this, function(check) {
            this.settings.set_boolean('dashtodock-hover', check.get_active());
        }));

        /* Add to layout */
        let dashIntegrationControlGrid = new Gtk.Grid({
            row_homogeneous: false,
            column_homogeneous: false,
            margin_top: 0,
            margin_left: 0,
            margin_bottom: 20
        });
        dashIntegrationControlGrid.attach(dashToDockHoverLabel, 0, 0, 1, 1);
        dashIntegrationControlGrid.attach(dashToDockHoverSwitch, 1, 0, 1, 1);


        /* ADD TO NOTEBOOK PAGE */
        notebookAdditionalSettings.add(workspaceCaptionsTitle);
        notebookAdditionalSettings.add(workspaceCaptionsControlGrid);
        notebookAdditionalSettings.add(workspaceCaptionsContainerGrid);
        notebookAdditionalSettings.add(customActionsTitle);
        notebookAdditionalSettings.add(customActionsControlGrid);
        notebookAdditionalSettings.add(dashIntegrationTitle);
        notebookAdditionalSettings.add(dashIntegrationControlGrid);
        notebook.append_page(notebookAdditionalSettings, notebookAdditionalSettingsTitle);



        this.add(notebook);

    },

    _getItemExists: function(item) {
        let currentItems = this.settings.get_strv('workspace-caption-items');
        let items = currentItems.map(function(el) {
            return el.split(':')[0];
        });

        let index = items.indexOf(item);

        if (index == -1)
            return false;

        return true;
    },

    _getItemExpanded: function(item) {
        let currentItems = this.settings.get_strv('workspace-caption-items');
        let items = currentItems.map(function(el) {
            return el.split(':')[0];
        });

        let index = items.indexOf(item);

        if (index == -1)
            return false;

        let currentItem = currentItems[index];
        let expandState = currentItem.split(':')[1];

        if (expandState == "false")
            return false

        return true;
    },

    _setItemExpanded: function(item, expandState) {
        let currentItems = this.settings.get_strv('workspace-caption-items');
        let items = currentItems.map(function(el) {
            return el.split(':')[0];
        });

        let index = items.indexOf(item);

        if (index == -1)
            return false;

        currentItems[index] = item + ":" + expandState;
        this.settings.set_strv('workspace-caption-items', currentItems);
        return true;
    },

    _addItem: function(item, expandState) {
        let currentItems = this.settings.get_strv('workspace-caption-items');
        let items = currentItems.map(function(el) {
            return el.split(':')[0];
        });

        let index = items.indexOf(item);

        if (index != -1)
            return false;

        let newitem = item + ":" + expandState;

        currentItems.push(newitem);
        this.settings.set_strv('workspace-caption-items', currentItems);
        return true;
    },

    _removeItem: function(item) {
        let currentItems = this.settings.get_strv('workspace-caption-items');
        let items = currentItems.map(function(el) {
            return el.split(':')[0];
        });

        let index = items.indexOf(item);

        if (index < 0)
            return false;

        currentItems.splice(index, 1);
        this.settings.set_strv('workspace-caption-items', currentItems);
        return true;
    },

    _moveItem: function(item, delta) {
        let currentItems = this.settings.get_strv('workspace-caption-items');
        let items = currentItems.map(function(el) {
            return el.split(':')[0];
        });

        let index = items.indexOf(item);

        if (index < 0)
            return false;

        let newIndex = index + delta;
        if (newIndex < 0 || newIndex >= currentItems.length || newIndex == index) {
            return false;
        }

        currentItems.splice(newIndex, 0, currentItems.splice(index, 1)[0]);
        this.settings.set_strv('workspace-caption-items', currentItems);
        return true;
    }
});

function init() {
    Convenience.initTranslations();
}

function buildPrefsWidget() {
    let widget = new WorkspacesToDockPreferencesWidget({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 5,
        border_width: 5
    });
    widget.show_all();

    return widget;
}
