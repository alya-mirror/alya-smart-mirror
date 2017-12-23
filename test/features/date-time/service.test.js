/* Alya Smart Mirror
 * Service tests
 *
 * By Bilal Al-Saeedi
 * MIT Licensed.
 */

'use strict';

describe('service test', () => {
  let dateTimeService;

  beforeEach(angular.mock.module('alya-smart-mirror'));

  beforeEach(inject((DateTimeService) => {
    dateTimeService = DateTimeService;
  }));

  it('update time', () => {
    const date = dateTimeService.updateTime();
    expect(date)
      .toBeDefined();
  });
});
