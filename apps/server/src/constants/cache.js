module.exports = {
  GALLERY_ALL_KEY: "gallery:all",
  GALLERY_TTL: 120,
  USERS_ALL_KEY: "users:all",
  USERS_TTL: 20,
  // Cap for the cached full-users list; bounds a cache-miss DoS.
  MAX_ALL_USERS: 1000,
  TESTS_PAGE_PREFIX: "tests:page",
  GROUPS_PAGE_PREFIX: "groups:page",
  // Long-lived metadata keys; every underlying mutation must invalidate these.
  TESTS_ALL_METADATA_KEY: "tests:all:metadata",
  GROUPS_ALL_METADATA_KEY: "groups:all:metadata",
  QUESTIONS_ALL_KEY: "questions_all",
  CONTACTS_KEY: "contacts:data",
  REVIEWS_ALL_KEY: "reviews:all",
};
