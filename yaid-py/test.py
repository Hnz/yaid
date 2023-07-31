from datetime import datetime
import unittest
import doctest
import yaid


def load_tests(loader, tests, ignore):
    """Run documentation  tests"""
    tests.addTests(doctest.DocTestSuite(yaid))
    return tests


class TestYAID(unittest.TestCase):
    def test_parse(self):
        y = yaid.parse("4X7BMTC6T6XEW")
        self.assertEqual(y.bytes, bytearray([39, 78, 186, 105, 134, 209, 186, 238]))

    def test_meta(self):
        y = yaid.YAID()
        self.assertEqual(y.meta(), 0)

        y.set_meta(123)
        self.assertEqual(y.meta(), 123)

        y.set_meta(255)
        self.assertEqual(y.meta(), 255)

        self.assertRaises(ValueError, y.set_meta, 256)
        self.assertRaises(ValueError, y.set_meta, -1)

    def test_time(self):
        y = yaid.YAID()
        y.set_time(datetime(2222, 1, 2, 3, 4, 5, 54321))
        self.assertEqual(y.bytes, bytearray([185, 40, 60, 54, 121, 0, 0, 0]))
        self.assertEqual(y.timestamp(), 795243984505)
        self.assertEqual(y.time(), datetime(2222, 1, 2, 3, 4, 5, 50000))

    def test_timestamp(self):
        y = yaid.YAID()
        self.assertEqual(y.bytes, bytearray([0, 0, 0, 0, 0, 0, 0, 0]))
        self.assertEqual(y.timestamp(), 0)

        y.set_timestamp(1)
        self.assertEqual(y.bytes, bytearray([0, 0, 0, 0, 1, 0, 0, 0]))
        self.assertEqual(y.timestamp(), 1)

        y.set_timestamp(32769)
        self.assertEqual(y.bytes, bytearray([0, 0, 0, 128, 1, 0, 0, 0]))
        self.assertEqual(y.timestamp(), 32769)

        y.set_timestamp(yaid.MAX_TIMESTAMP)
        self.assertEqual(y.bytes, bytearray([255, 255, 255, 255, 255, 0, 0, 0]))
        self.assertEqual(y.timestamp(), yaid.MAX_TIMESTAMP)


if __name__ == "__main__":
    unittest.main()
