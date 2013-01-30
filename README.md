workspaces-to-dock
==================

A Gnome Shell extension that transforms the workspaces of the overview mode into an intellihide dock.  The dock is positioned and sized to maintain tight integration with the Gnome Shell.

![screenshot](https://github.com/passingthru67/workspaces-to-dock/raw/master/Screenshot.png)


Installation:
------------
The easiest way to install Workspaces-to-Dock is from https://extensions.gnome.org/extension/427/workspaces-to-dock/ using your browser.

If you would rather install it manually, please download the appropriate zip file from the releases branch on Github (https://github.com/passingthru67/workspaces-to-dock/tree/releases). That zip file contains the same non-debug version of the extension as https://extensions.gnome.org and can be installed using Gnome Tweak tool.

	Gnome Tweak tool --> Shell Extensions --> Install from zip file --> choose the zip file.

If you're checking out code from the master branch (downloaded as zip or tar.gz), you will need to rename the extracted folder to workspaces-to-dock@passingthru67.gmail.com and manually copy it into your ~/.local/share/gnome-shell/extensions/ folder. I have included the gschemas.compiled file (compiled xml schema for gsettings) in the master branch so you won't have to compile it manually. 

	$ cp workspaces-to-dock@passingthru67@gmail.com ~/.local/share/gnome-shell/extensions/

Configure using `gnome-shell-extension-prefs`. No shell restarts required.


Main Settings:
--------------

![screenshot](https://github.com/passingthru67/workspaces-to-dock/raw/master/Prefs-Main.png)

- **Visibility:**

	**Dock is fixed and always visible** - The dock remains visible at all times.

	**Autohide** - When enabled, the dock shows when the mouse touches the right edge of screen. When disabled, the dock remains hidden unless the intellihide option is on or overview mode is entered.

	**Intellihide** - When enabled, the dock remains visible but hides itself when a window touches it. When disabled, dock remains hidden unless the autohide option is on or overview mode is entered.

	**Dodge all windows** - Intellihide option to dodge all windows.

	**Dodge all instances of focused app** - If multiple instances of the focused application are opened, all windows of that app are dodged.

	**Dodge only top instance of focused app** - If multiple instances of the focused application are opened, only the top instance window is dodged.

	**Animation time** - The time it takes the dock to slide from hidden to visible state and vise versa.

	**Show delay** - The time delayed before sliding the dock to the visible state.
		
	**NOTE: If you are having trouble with the mouse accidentally touching the right edge of the screen (usually due to using vertical scroll bars), adjust this delay higher (say around 700ms).**

	**Hide delay** - The time delayed before sliding the dock to the hidden state.

- **Background:**

	**Customize the dock background opacity** - Allows setting a different transparency value for the dock.

 	**Opacity** - Percentage of transparency desired.

	**Only when in autohide** - Only customize the opacity when the dock is shown by the mouse touching the right edge of the screen. In such cases, the dock is usually shown over other windows so that less transparency is desired.

- **Position:**

	**Show the dock on following monitor (if attached)** - Option to position the workspaces dock on a secondary monitor in dual monitor configurations.


Additional Settings:
--------------------

![screenshot](https://github.com/passingthru67/workspaces-to-dock/raw/master/Prefs-Additional.png)

- **Workspace Captions:**

	**Add captions to workspace thumbnails** - Adds captions to the workspace thumbnails.

	**User theme supports workspaces-to-dock captions** - When enabled, user themes that support workspaces-to-dock captions will be used to style the captions.

	**NOTE: Unfortunately, there is no built-in detection for when a theme supports workspaces-to-dock captions. Therefore, if this option is enabled, the default style will be disabled. We hope to provide auto-detection in a future release.**

	**Show the workspace number** - When enabled, the workspace number is shown in the caption. It can be expanded to take up available space or its position can be adjusted using the arrow buttons.

	**Show the workspace name** - When enabled, the workspace name is shown in the caption. It can be expanded to take up available space or its position can be adjusted using the arrow buttons.

	**NOTE: Workspace names can be edited using the Workspace Indicator extension. We hope to provide this ability in a future release.**

	**Show the workspace window count** - When enabled, the workspace window count is shown in the caption. It can be expanded to take up available space or its position can be adjusted using the arrow buttons. There is also an option to use images in place of text.

	**Show a spacer/filler** - When enabled, a spacer is inserted in the caption. It can be expanded to take up available space or its position can be adjusted using the arrow buttons.

- **Custom Actions:**

	**Toggle overview mode with right click** - When enabled, right clicking on the dock will toggle the overview mode.

- **Dash Integration:**

	**Show workspaces when hovering over Dash-To-Dock extension** - When enabled, hovering the mouse over the Dash-To-Dock extension will cause the workspaces dock to show.

	**Note: This feature is extremely useful in cases where your workspaces dock is hidden and you want to open a new app from the dash. Rather than going into overview just to see your workspaces, hover over the dash-to-dock extension. The workspaces dock will show to the right. Use the dash-to-dock scroll to go to the appropriate workspace.**


Workspace Caption Theming:
-------------------------
Adding support for workspaces-to-dock captions to a theme can be accomplished by incorporating the css classes found in workspace-captions.css (see extension folder) into the theme. If you prefer to maintain a separate css stylesheet for workspaces-to-dock captions, you can incorporate it into your theme using the @import directive. Please see the workspace-captions.css stylesheet for a description of these css classes.


Features Planned:
-----------------
- Localization
- Editing the workspace caption name.
- Closing workspaces (and all associated windows) with mouse click
- RTL support


Known Issues:
-------------
- Dual monitor configurations where 2nd monitor is on the right side - workspaces-to-dock prevents mouse clicks from reaching the desktop of the right monitor in the region where the dock is slid out (even though the dock is hidden). A workaround (other than positioning the dock on the secondary monitor) is to enable application based intellihide using the workspaces-to-dock extension preferences.
- Dual monitor configurations where workspaces-to-dock is positioned on the 2nd monitor, the dock overlaps window thumbnails when in overview mode.
- Changes to Gsetting's dynamic workspaces setting or number of static workspaces requires a restart of the workspaces-to-dock extension.

**Some causes of strange dynamic workspace behavior:**

- Letting Nautilus file manager handle the desktop  (this is an option in Gnome Tweak Tool).
- Using a dual monitor configuration with the workspaces-only-on-primary option under org->gnome->shell->overrides turned on.


Extensions That Cause Conflicts:
--------------------------------
- **Frippery Bottom Panel** - causes workspace scrolling issues
- **Native Window Placement** - causes overlapping of window thumbnails in overview mode
- **Workspace Grid** - causes overlapping of window thumbnails in overview mode


Bug Reporting:
--------------
If you run into any problelms with the extension, try resetting the extension to its default settings and restart Gnome Shell.  Test again to see if the behavior can be replicated.

To reset the extension to its default settings, type the command below in a terminal.

	$ dconf reset -f /org/gnome/shell/extensions/workspaces-to-dock/

If the behavior persists, try disabling all other extensions and enable each extension one at a time until the behavior reappears. You may be experiencing a conflict with another extension.

If the behavior persists with other extensions disabled, check for extension errors in Looking Glass (Gnome Shell 3.4) or by typing gnome-shell --replace in a terminal and watching for JS error logs.

If the problem persists, please report it by opening an issue on github or with a bug report message on the extension website.


Change Log:
-----------
**version 8 (Jan 26, 2013)**

- Option to display workspace thumbnail captions (feature)
- Ability to toggle overview mode with right click (feature)
- Another intellihide option for dodging the top instance of an application (feature)
- Ability to position the dock on secondary monitors.
- Bug fixes

**version 7 (Nov 3, 2012)**

- Bug fixes
- Show workspaces dock on Dash-To-Dock hover (feature)

    Dash-To-Dock hover shows the workspaces dock when hovering over the dash-to-dock extension (if you've got it installed). 
    Extremely useful in cases where your workspaces dock is hidden and you want to open a new app from the dash. Rather than going into overview just to see your workspaces, hover over the dash-to-dock extension. The workspaces dock will show to the right. Use the dash-to-dock scroll to go to the appropriate workspace.

**version 6 (Oct 26, 2012)**

- Support for Gnome Shell 3.6 and new lock screen
- Better support for static workspaces
- Application based intellihide (feature)
- Bug fixes

    **NOTE: Changes to Gsetting's dynamic workspaces setting or number of static workspaces requires a restart of the workspaces-to-dock extension**

**version 5 (Sept 11, 2012)**

- Bug fixes

**version 4 (Sept 6, 2012)**

- Better stationary/fixed dock support.
- Intellihide enhancements to dodge Gnome Shell panel menus after initialization.
- Bug fixes

**version 3 (Aug 31, 2012)**

- Reworked the code for adding/removing workspaces. Not only fixed the firefox issue, but also made displaying workspaces smoother and more consistant with Gnome Shell behavior.
- Intellihide enhancement to dodge resulting icons from Gnome Shell search panel.

**version 2 (Aug 28, 2012)**

- Scrolling the mouse wheel over the dock now switches workspaces.
- Intellihide enhancements to dodge Gnome Shell panel and messsagetray popup menus.

**version 1 (Aug 15, 2012)**

- Initial extension based on the dash-to-dock v10 code (https://github.com/micheleg/dash-to-dock).

