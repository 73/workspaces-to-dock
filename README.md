workspaces-to-dock
==================

A Gnome Shell extension that transforms the workspaces of the overview mode into an intellihide dock.  The dock is positioned and sized to maintain tight integration with the Gnome Shell.


Installation
------------
The easiest way to install Workspaces-to-Dock is from https://extensions.gnome.org/extension/427/workspaces-to-dock/
Otherwise, you may download the .zip file from the Downloads page (https://github.com/passingthru67/workspaces-to-dock/downloads) or checkout the code from the master branch.

If you have the .zip file, go to Gnome tweak tools --> Shell Extensions --> Install from zip file --> choose the zip file.

If you have the source code, copy the folder to the appropriate place:

	$ cp workspaces-to-dock@passingthru67@gmail.com ~/.local/share/gnome-shell/extensions/

Configure using `gnome-shell-extension-prefs`. No shell restarts required.


Changelog:
----------
v2

- Scrolling over dock now switches workspaces.
- Intellihide enhancements added to dodge Gnome Shell panel and messsagetray popup menus.

v1

- Initial extension based on the dash-to-dock v10 code.



Features Planned:
-----------------
- Option to select which monitor to place dock on
- RTL support




Issues:
-------
- Stationary/Fixed (always visible) dock needs work to properly allow messageTray popup menus to react with mouse hover and clicks.
- If you are using multiple monitors, it is recommended that you turn off the workspaces-only-on-primary option under org->gnome->shell->overrides (use dconf-editor). Gnome 3.4 seems buggy when using multiple monitors with the workspaces-only-on-primary option turned on.


