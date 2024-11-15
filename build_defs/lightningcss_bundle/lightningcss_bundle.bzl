"""
Rollup bundle rule.
"""

load("@aspect_rules_js//js:defs.bzl", "js_run_binary")

def lightningcss_bundle(name, srcs, entry_point, visibility):
    # type: (string, list[string], string, list[string]) -> None
    """
    Create a JS bundle using an opinionated Rollup configuration.

    Args:
        name: The name of the target.
        srcs: Source files to be considered for bundle inclusion.
        entry_point: Roots from which to start bundling.
        visibility: List of targets that can depend on this target.
    """
    args = ["--out-dir", name]
    outs = []
    
    # Handle entry point
    args.append("--entry-point")
    args.append(entry_point)
    outs.append("%s/%s" % (name, entry_point.replace("src/", "").replace("public/", "")))

    js_run_binary(
        name = name,
        tool = "//build_defs/lightningcss_bundle:bin",
        args = args,
        srcs = srcs,
        outs = outs,
        chdir = native.package_name(),
        mnemonic = "LightningCssBundle",
        visibility = visibility,
    )
