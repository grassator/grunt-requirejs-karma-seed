/*global describe, it */

define(['main'], function (main) {
  describe('Give it some context', function () {
      it('should be something', function () {
        expect(main).toEqual("works");
      });
  });
});



