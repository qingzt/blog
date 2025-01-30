from flask import make_response, jsonify

class JsonResponse:
    def __init__(self, code=0, msg="Success", data=None):
        self.code = code
        self.msg = msg
        self.data = data
    def response(self):
        response = make_response(jsonify(self.__dict__), 200)
        response.headers["Content-Type"] = "application/json"
        return response
    @staticmethod
    def success(data=None):
        return JsonResponse(data=data).response()