"""Shared test fixtures for Immortal Sect game tests."""
import json
import pytest
from pathlib import Path


@pytest.fixture
def sample_disciple():
    """A basic disciple for testing."""
    return {
        "id": "test-disciple-1",
        "name": "Test Cultivator",
        "realm": "Qi Condensation",
        "qi": 50,
        "maxQi": 200,
        "talent": 5,
        "loyalty": 80,
        "traits": ["Diligent"],
    }


@pytest.fixture
def sample_sect(sample_disciple):
    """A basic sect state for testing."""
    return {
        "name": "Test Sect",
        "reputation": 10,
        "spiritStones": 100,
        "disciples": [sample_disciple],
        "buildings": [],
        "techniques": [],
    }


@pytest.fixture
def sample_game_state(sample_sect):
    """A full game state for testing."""
    return {
        "sect": sample_sect,
        "turn": 1,
        "season": "Spring",
        "year": 1,
        "events": [],
    }


@pytest.fixture
def project_root():
    """Path to the project root."""
    return Path(__file__).parent.parent


@pytest.fixture
def src_path(project_root):
    """Path to the src directory."""
    return project_root / "src"
