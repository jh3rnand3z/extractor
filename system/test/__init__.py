# http://www.tornadoweb.org/en/stable/testing.html#tornado.testing.main

class MyHTTPTest(AsyncHTTPTestCase):
    def get_app(self):
        return Application([('/', MyHandler)...])

    def test_homepage(self):
        # The following two lines are equivalent to
        #   response = self.fetch('/')
        # but are shown in full here to demonstrate explicit use
        # of self.stop and self.wait.
        self.http_client.fetch(self.get_url('/'), self.stop)
        response = self.wait()
        # test contents of response
