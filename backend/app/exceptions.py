class BookingError(Exception):
    status_code = 400

    def __init__(self, detail: str):
        self.detail = detail
        super().__init__(detail)


class NotFoundError(BookingError):
    status_code = 404


class ConflictError(BookingError):
    status_code = 409


class RelationshipError(BookingError):
    status_code = 400

