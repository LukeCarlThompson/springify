# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.3]

### Fixed

- Fixed package export path.

## [3.0.2]

### Fixed

- Fixed build process to export types correctly.

## [3.0.1]

### Changed

- updated `README.md` with syntax highlighting for code blocks

## [3.0.0]

### Removed

- `onFrame` callback in constructor
- `onFinished` callback in constructor

### Added

- `subscribe` method to replace `onFrame` and `onFinshed` callback functions
- `unsubscribe` function returned from `subscribe` method
