from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.api import router
from app.exceptions import BookingError

app = FastAPI(title="EditingTab Booking", version="0.1.0")
app.include_router(router)


@app.exception_handler(BookingError)
async def booking_error_handler(_: Request, exc: BookingError) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


@app.get("/health", include_in_schema=False)
async def health() -> dict[str, str]:
    return {"status": "ok"}

