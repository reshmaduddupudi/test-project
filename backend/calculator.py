import ast
import operator

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api")

_BIN_OPS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.Mod: operator.mod,
    ast.Pow: operator.pow,
}
_UNARY_OPS = {ast.UAdd: operator.pos, ast.USub: operator.neg}


class CalcRequest(BaseModel):
    expression: str


class CalcResponse(BaseModel):
    expression: str
    result: float


def _eval(node):
    """Safely evaluate a parsed arithmetic expression (no eval())."""
    if isinstance(node, ast.Expression):
        return _eval(node.body)
    if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
        return node.value
    if isinstance(node, ast.BinOp) and type(node.op) in _BIN_OPS:
        left, right = _eval(node.left), _eval(node.right)
        if isinstance(node.op, ast.Pow) and abs(right) > 100:
            raise ValueError("Exponent too large")
        return _BIN_OPS[type(node.op)](left, right)
    if isinstance(node, ast.UnaryOp) and type(node.op) in _UNARY_OPS:
        return _UNARY_OPS[type(node.op)](_eval(node.operand))
    raise ValueError("Unsupported expression")


@router.post("/calculate", response_model=CalcResponse)
def calculate(payload: CalcRequest):
    expr = payload.expression.replace("×", "*").replace("÷", "/").strip()
    if not expr or len(expr) > 200:
        raise HTTPException(status_code=400, detail="Invalid expression")
    try:
        result = _eval(ast.parse(expr, mode="eval"))
    except ZeroDivisionError:
        raise HTTPException(status_code=400, detail="Cannot divide by zero")
    except (SyntaxError, ValueError, TypeError, OverflowError):
        raise HTTPException(status_code=400, detail="Invalid expression")
    return CalcResponse(expression=payload.expression, result=result)
