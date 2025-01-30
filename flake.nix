{
  description = "murex: the astal shell";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    astal = {
      url = "github:aylur/astal";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };
  outputs = {
    self,
    nixpkgs,
    astal,
    ags,
  }: let
    projectName = "murex";
    supportedSystems = ["x86_64-linux"];
    forSystems = systems: f:
      nixpkgs.lib.genAttrs systems
      (system:
        f system (import nixpkgs {
          inherit system;
        }));
    forAllSystems = forSystems supportedSystems;
  in {
    formatter = forAllSystems (system: pkgs: pkgs.alejandra);

    packages = forAllSystems (system: pkgs: {
      default = pkgs.stdenvNoCC.mkDerivation (finalAttrs: {
        name = projectName;
        pname = projectName;

        src = ./.;

        nativeBuildInputs = with pkgs; [
          ags.packages.${pkgs.system}.default
          wrapGAppsHook
          gobject-introspection
          pnpm.configHook
          nodejs_23
          makeWrapper
        ];

        buildInputs = with astal.packages.${system}; [
          astal4
          gjs
          hyprland
        ];

        pnpmDeps = pkgs.pnpm.fetchDeps {
          inherit (finalAttrs) name pname src;
          hash = "sha256-JS0KMXvrDuNDoOQqzwHETf3uRsYQt0oROt+BjEBq3n8=";
        };

        buildPhase = ''
          export ASTAL_PATH=${astal.packages.${system}.gjs}/share/astal/gjs
          pnpm run build
        '';

        installPhase = ''
          mkdir -p $out/{bin,lib}
          mv ./out/murex $out/lib/murex-shell
          makeWrapper ${ags.packages.${system}.ags}/bin/ags $out/bin/murex \
            --add-flags "run $out/lib/murex-shell --gtk4"
        '';

        postInstall = ''
'';
      });
    });

    devShells = forAllSystems (system: pkgs: {
      default = pkgs.mkShell {
        buildInputs = with pkgs; [
          (ags.packages.${system}.default.override {
            extraPackages = with ags.packages.${system}; [
              hyprland
              io
              network
            ];
          })
          (with astal.packages.${system}; [
            astal4
            hyprland
            network
            io
          ])

          nodejs_23
          nodePackages_latest.pnpm
          nodePackages_latest.prettier
          nodePackages_latest.typescript-language-server

          esbuild

          gjs
          gtk4-layer-shell
        ];

        ASTAL_PATH = "${astal.packages.${system}.gjs}/share/astal/gjs";
        # LD_PRELOAD = "${pkgs.gtk4-layer-shell}/lib/libgtk4-layer-shell.so";
      };
    });
  };
}
