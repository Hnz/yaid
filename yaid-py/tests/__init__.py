import unittest
import doctest
import yaid


def load_tests(loader, tests, ignore):
    """Run documentation tests"""
    tests.addTests(doctest.DocTestSuite(yaid))
    return tests


class TestStringMethods(unittest.TestCase):
    def test_upper(self):
        self.assertEqual("foo".upper(), "FOO")

    def test_isupper(self):
        self.assertTrue("FOO".isupper())
        self.assertFalse("Foo".isupper())

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
