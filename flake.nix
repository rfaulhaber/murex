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
      default = pkgs.stdenvNoCC.mkDerivation {
        name = projectName;
        pname = projectName;

        src = ./.;

        nativeBuildInputs = with pkgs; [
          ags.packages.${pkgs.system}.default
          wrapGAppsHook
          gobject-introspection
        ];

        buildInputs = with astal.packages.${system}; [
          astal3
          io
        ];

        installPhase = ''
          mkdir -p $out/bin
          ags bundle app.ts $out/bin/${projectName}
        '';
      };
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
        ];
      };
    });
  };
}
