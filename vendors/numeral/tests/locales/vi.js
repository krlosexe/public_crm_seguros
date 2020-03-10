// Node
if (typeof module !== 'undefined' && module.exports) {
    var numeral = require('../../numeral');
    var locales = require('../../locales');
    var expect = require('chai').expect;
}

describe('Locale: vi', function() {

    before(function() {
        numeral.locale('vi');
    });

    after(function() {
        numeral.reset();
    });

    describe('Number', function() {
        it('should format a number', function() {
            var tests = [
                [10000,'0,0.0000','10.000,0000'],
                [10000.23,'0,0','10.000'],
                [-10000,'0,0.0','-10.000,0'],
                [10000.1234,'0.000','10000,123'],
                [-10000,'(0,0.0000)','(10.000,0000)'],
                [-0.23,'.00','-,23'],
                [-0.23,'(.00)','(,23)'],
                [0.23,'0.00000','0,23000'],
                [1230974,'0.0a','1,2 triệu'],
                [1460,'0a','1 nghìn'],
                [-104000,'0a','-104 nghìn'],
                [1,'0o','1.'],
                [52,'0o','52.'],
                [23,'0o','23.'],
                [100,'0o','100.'],
                [1,'0[.]0','1']
            ];

            for (var i = 0; i < tests.length; i++) {
                expect(numeral(tests[i][0]).format(tests[i][1])).to.equal(tests[i][2]);
            }
        });
    });

    describe('Currency', function() {
        it('should format a currency', function() {
            var tests = [
                [1000.234,'0,0.00 $','1.000,23 ₫'],
                [-1000.234,'(0,0 $)','(1.000 ₫)'],
                [-1000.234,'0.00 $','-1000,23 ₫'],
                [1230974,'(0.00a $)','1,23 triệu ₫']
            ];

            for (var i = 0; i < tests.length; i++) {
                expect(numeral(tests[i][0]).format(tests[i][1])).to.equal(tests[i][2]);
            }
        });
    });

    describe('Percentages', function() {
        it('should format a percentages', function() {
            var tests = [
                [1,'0%','100%'],
                [0.974878234,'0.000%','97,488%'],
                [-0.43,'0%','-43%'],
                [0.43,'(0.000%)','43,000%']
            ];

            for (var i = 0; i < tests.length; i++) {
                expect(numeral(tests[i][0]).format(tests[i][1])).to.equal(tests[i][2]);
            }
        });
    });

    describe('Unformat', function() {
        it('should unformat', function() {
            var tests = [
                ['10.000,123',10000.123],
                ['(0,12345)',-0.12345],
                ['1 nghìn', 1000],
                ['1 triệu',1000000],
                ['1 tỷ', 1000000000],
                ['1 nghìn tỷ', 1000000000000],
                ['1,2 nghìn', 1200],
                ['1,2 tỷ', 1200000000],
                ['1.000.000', 1000000],
                ['1.000.000,2', 1000000.2],
                ['10.000.000', 10000000],
                ['-76%',-0.76],
                ['2:23:57',8637]
            ];

            for (var i = 0; i < tests.length; i++) {
                expect(numeral(tests[i][0]).value()).to.equal(tests[i][1]);
            }
        });
    });
});
