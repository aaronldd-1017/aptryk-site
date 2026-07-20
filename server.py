#!/usr/bin/env python3
"""Simple static file server with clean URL support.
Maps /book -> /book.html, /start -> /start.html, /library -> /library.html, etc.
"""
import http.server
import os
import sys


class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        # Strip query string
        path = path.split('?', 1)[0]
        path = path.split('#', 1)[0]

        # Try the path as-is first (via parent)
        result = super().translate_path(path)
        if os.path.exists(result) and not os.path.isdir(result):
            return result

        # Try with .html extension
        html_path = super().translate_path(path.rstrip('/') + '.html')
        if os.path.exists(html_path):
            return html_path

        # Try directory index
        if os.path.isdir(result):
            index = os.path.join(result, 'index.html')
            if os.path.exists(index):
                return index

        return result

    def log_message(self, format, *args):
        # Suppress logs for cleaner output
        pass


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    os.chdir(os.path.dirname(os.path.abspath(__file__)) if __file__ != '<stdin>' else '.')
    handler = CleanURLHandler
    handler.extensions_map = {
        '': 'application/octet-stream',
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.ico': 'image/x-icon',
        '.json': 'application/json',
        '.woff2': 'font/woff2',
        '.woff': 'font/woff',
    }
    with http.server.HTTPServer(('', port), handler) as httpd:
        print(f'Serving on port {httpd.server_address[1]}', flush=True)
        httpd.serve_forever()
