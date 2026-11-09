# Changelog

## [Unreleased]

### Fixed

- Removed stale duplicate source files whose names contained trailing
  newline characters; they had been included in the Composer archive.
- The package is explicitly a library and refuses
  `composer create-project sahilphp/react` through
  `post-create-project-cmd`, exiting 1 with installation guidance.
