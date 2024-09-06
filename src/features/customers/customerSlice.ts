import { Action } from "redux";

const customerInitialState = {
  fullName: "",
  nationalID: "",
  createdAt: "",
};

interface CustomerState {
  fullName: string;
  nationalID: string;
  createdAt: string;
}

interface CreateCustomerAction extends Action {
  type: "customer/createCustomer";
  payload: {
    fullName: string;
    nationalID: string;
    createdAt: string;
  };
}

interface UpdateNameAction extends Action {
  type: "customer/updateName";
  payload: {
    fullName: string;
  };
}

type CustomerActions = CreateCustomerAction | UpdateNameAction;

export default function custumerReducer(
  state: CustomerState = customerInitialState,
  action: CustomerActions
) {
  switch (action.type) {
    case "customer/createCustomer":
      return {
        ...state,
        fullName: action.payload.fullName,
        nationalID: action.payload.nationalID,
        createdAt: action.payload.createdAt,
      };
    case "customer/updateName":
      return {
        ...state,
        fullName: action.payload.fullName,
      };
    default:
      return state;
  }
}

export function createCustomer(
  fullName: string,
  nationalID: string
): CreateCustomerAction {
  return {
    type: "customer/createCustomer",
    payload: { fullName, nationalID, createdAt: new Date().toISOString() },
  };
}

export function updateName(fullName: string): UpdateNameAction {
  return { type: "customer/updateName", payload: { fullName } };
}
