"""Tests to verify project source structure and conventions."""
from pathlib import Path


class TestProjectStructure:
    """Ensure the project follows required directory structure."""

    def test_src_directory_exists(self, project_root):
        assert (project_root / "src").is_dir()

    def test_components_directory_exists(self, src_path):
        assert (src_path / "components").is_dir()

    def test_types_directory_exists(self, src_path):
        assert (src_path / "types").is_dir()

    def test_hooks_directory_exists(self, src_path):
        assert (src_path / "hooks").is_dir()

    def test_game_types_file_exists(self, src_path):
        assert (src_path / "types" / "game.ts").is_file()

    def test_app_entry_exists(self, src_path):
        assert (src_path / "App.tsx").is_file()

    def test_main_entry_exists(self, src_path):
        assert (src_path / "main.tsx").is_file()


class TestCodeConventions:
    """Verify code follows project conventions."""

    def test_no_files_exceed_800_lines(self, src_path):
        for ts_file in src_path.rglob("*.ts*"):
            lines = ts_file.read_text().splitlines()
            assert len(lines) <= 800, f"{ts_file.name} exceeds 800 lines ({len(lines)})"

    def test_types_use_interfaces(self, src_path):
        game_types = (src_path / "types" / "game.ts").read_text()
        assert "interface" in game_types, "Types file should use TypeScript interfaces"

    def test_no_hardcoded_secrets(self, src_path):
        secret_patterns = ["API_KEY", "SECRET_KEY", "password =", "token ="]
        for ts_file in src_path.rglob("*.ts*"):
            content = ts_file.read_text()
            for pattern in secret_patterns:
                assert pattern not in content, f"Potential secret in {ts_file.name}: {pattern}"
