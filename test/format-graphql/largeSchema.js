/**
 * @file Test format-grpahql against large schemas
 * (Regression test for https://github.com/gajus/format-graphql/issues/10)
 */

import generateSchema from "../helpers/generate-schema";

test("sort on large schemas", (t) => {
  const input = generateSchema(1000, 1);

  // santiy check to make sure these don't blow up
  t.notThrows(() => formatSdl(input));
  t.notThrows(() =>
    formatSdl(input, {
      sortArguments: true,
      sortDefinitions: true,
      sortFields: true,
    })
  );
});
