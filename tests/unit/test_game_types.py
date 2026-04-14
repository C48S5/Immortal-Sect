"""Unit tests for game type validation and data integrity."""
import json
import re
from pathlib import Path


class TestCultivationRealms:
    """Verify cultivation realm definitions are consistent."""

    EXPECTED_REALMS = [
        "Mortal Body",
        "Qi Condensation",
        "Foundation Establishment",
        "Core Formation",
        "Nascent Soul",
        "Spirit Severing",
        "Dao Seeking",
        "Immortal",
    ]

    def test_realm_count(self, src_path):
        game_types = (src_path / "types" / "game.ts").read_text()
        enum_block = game_types.split("export enum CultivationRealm", 1)[1].split("}", 1)[0]
        realm_matches = re.findall(r"^\s*\w+\s*=\s*'([^']+)'", enum_block, re.MULTILINE)
        assert len(realm_matches) == len(self.EXPECTED_REALMS)

    def test_realm_names_exist(self, src_path):
        game_types = (src_path / "types" / "game.ts").read_text()
        for realm in self.EXPECTED_REALMS:
            assert realm in game_types, f"Missing realm: {realm}"


class TestDiscipleData:
    """Verify disciple data structure."""

    def test_disciple_has_required_fields(self, sample_disciple):
        required = ["id", "name", "realm", "qi", "maxQi", "talent", "loyalty", "traits"]
        for field in required:
            assert field in sample_disciple, f"Missing field: {field}"

    def test_qi_within_bounds(self, sample_disciple):
        assert 0 <= sample_disciple["qi"] <= sample_disciple["maxQi"]

    def test_talent_range(self, sample_disciple):
        assert 1 <= sample_disciple["talent"] <= 10

    def test_loyalty_range(self, sample_disciple):
        assert 0 <= sample_disciple["loyalty"] <= 100


class TestSectData:
    """Verify sect data structure."""

    def test_sect_has_required_fields(self, sample_sect):
        required = ["name", "reputation", "spiritStones", "disciples", "buildings", "techniques"]
        for field in required:
            assert field in sample_sect, f"Missing field: {field}"

    def test_spirit_stones_non_negative(self, sample_sect):
        assert sample_sect["spiritStones"] >= 0

    def test_disciples_is_list(self, sample_sect):
        assert isinstance(sample_sect["disciples"], list)


class TestGameState:
    """Verify game state structure."""

    VALID_SEASONS = ["Spring", "Summer", "Autumn", "Winter"]

    def test_initial_turn(self, sample_game_state):
        assert sample_game_state["turn"] == 1

    def test_valid_season(self, sample_game_state):
        assert sample_game_state["season"] in self.VALID_SEASONS

    def test_year_positive(self, sample_game_state):
        assert sample_game_state["year"] >= 1
