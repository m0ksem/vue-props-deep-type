/* eslint-disable no-undef */
const VuePropsTypes = require('./index');

describe('VuePropsTypes', () => {
  describe('Primitives', () => {
    it('Array', () => {
      const arrayItemType = {
        name: String,
      };
      const prop = VuePropsTypes.Array(arrayItemType);
      expect(prop.type).toBe(Array);
      expect(prop.item).toBe(arrayItemType);
    });

    it('Object', () => {
      const objectType = {
        age: Number,
      };
      const prop = VuePropsTypes.Object(objectType);
      expect(prop.type).toBe(objectType);
    });
  });

  describe('Tests', () => {
    const t = VuePropsTypes;
    it('Object', () => {
      const prop = t.deep({
        name: { type: String, required: true },
        age: Number,
      });

      const results = [
        prop.test({
          name: 'Maksim',
          age: 20,
        }),
        prop.test({
          fio: 'Maksim',
          age: 20,
        }),
        prop.test({
          name: 'Maksim',
          age: '20 y.o.',
        }),
        prop.test(['Maksim', 20]),
      ];

      expect(results).toEqual([true, false, false, false]);
    });

    describe('Nested objects', () => {
      const prop = t.deep({
        fio: {
          firstName: { type: String, required: true },
          secondName: { type: String, required: true },
          thirdName: String,
        },
        age: Number,
      });

      it('All valid types to be true', () => {
        expect(
          prop.test({
            fio: {
              firstName: 'Maksim',
              secondName: 'Nedoshev',
              thirdName: 'SomeString',
            },
            age: 20,
          }),
        ).toBeTruthy();
      });

      it('Nested object have no non required property to be true', () => {
        expect(
          prop.test({
            fio: {
              firstName: 'Maksim',
              secondName: 'Nedoshev',
            },
            age: 20,
          }),
        ).toBeTruthy();
      });

      it('No non required properties to be true', () => {
        expect(
          prop.test({
            fio: {
              firstName: 'Maksim',
              secondName: 'Nedoshev',
            },
          }),
        ).toBeTruthy();
      });

      it('Required property of nested object have wrong type to be false', () => {
        expect(
          prop.test({
            fio: {
              firstName: 'Maksim',
              secondName: 2,
              thirdName: 'String',
            },
          }),
        ).toBeFalsy();
      });

      it('Non required property of nested object have wrong type to be false', () => {
        expect(
          prop.test({
            fio: {
              firstName: 'Maksim',
              secondName: 'Nedoshev',
              thirdName: 3,
            },
          }),
        ).toBeFalsy();
      });
    });

    describe('Multi types', () => {
      describe('Prop can be String or Number', () => {
        const prop = t.deep([String, Number]);
        it('Prop is Number to be true', () => {
          expect(prop.test(123)).toBeTruthy();
        });
        it('Prop is String to be true', () => {
          expect(prop.test('Im a string!')).toBeTruthy();
        });
        it('Prop is Object to be false', () => {
          expect(prop.test({ value: 123 })).toBeFalsy();
        });
        it('Prop is Array to be false', () => {
          expect(prop.test(['Im a string!'])).toBeFalsy();
        });
      });
      describe('Prop can be Object or Array', () => {
        const prop = t.deep([Object, Array]);
        it('Prop is Number to be false', () => {
          expect(prop.test(123)).toBeFalsy();
        });
        it('Prop is String to be false', () => {
          expect(prop.test('Im a string!')).toBeFalsy();
        });
        it('Prop is Object to be true', () => {
          expect(prop.test({ value: 123 })).toBeTruthy();
        });
        it('Prop is Array to be true', () => {
          expect(prop.test(['Im a string!'])).toBeTruthy();
        });
      });
    });

    describe('Array', () => {
      describe('String array', () => {
        const prop = t.deep(t.Array(String));

        it('All string to be true', () => {
          expect(prop.test(['Hello', 'Im', 'Maksim'])).toBeTruthy();
        });
        it('All string, but one Number to be false', () => {
          expect(prop.test(['Hello', 'Im', 20])).toBeFalsy();
        });
        it('Clear Array to be true', () => {
          expect(prop.test([])).toBeTruthy();
        });
      });
      describe('Objects array', () => {
        const prop = t.deep(
          t.Array({
            name: [
              String,
              {
                firstName: { type: String, required: true },
                lastName: String,
              },
            ],
            age: Number,
          }),
        );

        it('Clear array to be true', () => {
          expect(prop.test([])).toBeTruthy();
        });
        it('All properties to be true', () => {
          expect(
            prop.test([
              {
                name: 'Maksim',
                age: 20,
              },
              {
                name: {
                  firstName: 'Denis',
                  lastName: 'LastName',
                },
              },
            ]),
          ).toBeTruthy();
        });
        it('Nested object required if its can be String to be false', () => {
          expect(
            prop.test([
              {
                name: 'Maksim',
                age: 20,
              },
              {
                name: {
                  name: 'Denis',
                },
              },
            ]),
          ).toBeFalsy();
        });
      });

      describe('Array multi types', () => {
        const prop = t.deep(
          t.Array([
            String,
            {
              name: { type: String, required: true },
              age: Number,
            },
          ]),
        );

        it('Array from Strings or Objects to be true', () => {
          expect(
            prop.test([
              'Maksim',
              {
                name: 'Maksim',
              },
              {
                name: 'Cool',
                age: 20,
              },
            ]),
          ).toBeTruthy();
        });
        it('Array from Strings, Arrays or Objects to be true', () => {
          expect(
            prop.test([
              'Maksim',
              {
                name: 'Maksim',
              },
              ['Maksim'],
              {
                name: 'Cool',
                age: 20,
              },
            ]),
          ).toBeFalsy();
        });
        it('Array from Strings or Objects but object with incorrect type to be true', () => {
          expect(
            prop.test([
              'Maksim',
              {
                name: 'Maksim',
              },
              ['Maksim'],
              {
                name: 'Cool',
                age: '20',
              },
            ]),
          ).toBeFalsy();
        });
      });
    });

    describe('Concrete values types', () => {
      it('Prop can be "on" or "off" only', () => {
        const prop = t.deep(['on', 'off']);
        expect(prop.test('on')).toBeTruthy();
        expect(prop.test(['on', 'off'])).toBeFalsy();
      });
      it('Array items can be only weekday', () => {
        const prop = t.deep(
          t.Array([
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            ['Saturday', 'Sunday'],
          ]),
        );

        expect(prop.test(['Sunday', 'Monday'])).toBeTruthy();
        expect(prop.test(['January', 'February'])).toBeFalsy();
      });
    });

    describe('Very deep type checking', () => {
      const prop = t.deep({
        type: Array,
        item: [
          String,
          {
            user: {
              type: {
                name: {
                  required: true,
                  type: [
                    String,
                    {
                      firstName: { type: String, required: true },
                      lastName: String,
                    },
                  ],
                },
                age: Number,
              },
            },
            required: true,
          },
        ],
        required: true,
        notClear: true,
      });

      it('Array is required', () => {
        expect(prop.test()).toBeFalsy();
      });

      it('Clear array', () => {
        expect(prop.test([])).toBeFalsy();
      });

      it('Array item can be string', () => {
        expect(prop.test(['Maksim', 'Sasha'])).toBeTruthy();
      });

      it('Array item is JSON without required deep property', () => {
        expect(
          prop.test([
            {
              user: {
                age: 20,
              },
            },
          ]),
        ).toBeFalsy();
      });

      it('Array item is JSON without non required deep property', () => {
        expect(
          prop.test([
            {
              user: {
                name: {
                  firstName: 'Maksim',
                },
                age: 20,
              },
            },
          ]),
        ).toBeTruthy();
      });

      it('Array item is JSON with all properties', () => {
        expect(
          prop.test([
            {
              user: {
                name: {
                  firstName: 'Maksim',
                  lastName: 'Sasha',
                },
                age: 20,
              },
            },
          ]),
        ).toBeTruthy();
      });
      it('Array item is JSON with wrong non required property', () => {
        expect(
          prop.test([
            {
              user: {
                name: {
                  firstName: 'Maksim',
                  lastName: 123,
                },
                age: 20,
              },
            },
          ]),
        ).toBeFalsy();
      });
    });
  });
});
