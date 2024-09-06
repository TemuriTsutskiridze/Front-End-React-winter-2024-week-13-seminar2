import { Action } from "redux";
import { ThunkAction } from "redux-thunk";

type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AccountState,
  unknown,
  Action<string>
>;

const accountInitialState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};

interface AccountState {
  balance: number;
  loan: number;
  loanPurpose: string;
  isLoading: boolean;
}

interface DepositAction extends Action {
  type: "account/deposit";
  payload: number;
}

interface WithdrawAction extends Action {
  type: "account/withdraw";
  payload: number;
}

interface RequestLoanAction extends Action {
  type: "account/requestLoan";
  payload: {
    amount: number;
    purpose: string;
  };
}

interface PayLoanAction extends Action {
  type: "account/payLoan";
}

interface ConvertingCurrencyAction extends Action {
  type: "account/convertingCurrency";
}

type AccountActions =
  | DepositAction
  | WithdrawAction
  | RequestLoanAction
  | PayLoanAction
  | ConvertingCurrencyAction;

export default function accountReducer(
  state: AccountState = accountInitialState,
  action: AccountActions
) {
  switch (action.type) {
    case "account/deposit":
      return {
        ...state,
        balance: state.balance + action.payload,
        isLoading: false,
      };

    case "account/withdraw":
      if (state.balance < action.payload) return state;
      return {
        ...state,
        balance: state.balance - action.payload,
      };

    case "account/requestLoan":
      if (state.loan > 0) return state;
      return {
        ...state,
        balance: state.balance + action.payload.amount,
        loan: action.payload.amount,
        loanPurpose: action.payload.purpose,
      };

    case "account/payLoan":
      if (state.balance < state.loan) return state;
      return {
        ...state,
        loan: 0,
        loanPurpose: "",
        balance: state.balance - state.loan,
      };
    case "account/convertingCurrency":
      return {
        ...state,
        isLoading: true,
      };
    default:
      return state;
  }
}

export function deposit(
  amount: number,
  currency: string
): DepositAction | AppThunk {
  if (currency === "USD") return { type: "account/deposit", payload: amount };

  return async function (dispatch) {
    dispatch({ type: "account/convertingCurrency" });
    const host = "api.frankfurter.app";
    const response = await fetch(
      `https://${host}/latest?amount=${amount}&from=${currency}&to=USD`
    );
    const data = await response.json();
    const convertedAmount = data.rates.USD;

    dispatch({ type: "account/deposit", payload: convertedAmount });
  };
}

export function withdraw(amount: number): WithdrawAction {
  return { type: "account/withdraw", payload: amount };
}

export function requestLoan(
  amount: number,
  purpose: string
): RequestLoanAction {
  return { type: "account/requestLoan", payload: { amount, purpose } };
}

export function payLoan(): PayLoanAction {
  return { type: "account/payLoan" };
}
