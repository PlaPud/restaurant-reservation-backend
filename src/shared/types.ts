export const TYPES = {
  CustomerRepository: Symbol.for("ICustomerRepository"),
  InMemoryCustomerRepository: Symbol.for("InMemoryCustomerRepository"),
  CreateCustomerUseCase: Symbol.for("CreateCustomerUseCase"),
  GetCustomerUseCase: Symbol.for("GetCustomerUseCase"),
  GetAllCustomerUseCase: Symbol.for("GetAllCustomerUseCase"),
  UpdateCustomerUseCase: Symbol.for("UpdateCustomerUseCase"),
  DeleteCustomerUseCase: Symbol.for("DeleteCustomerUseCase"),
  DeleteAllCustomerUseCase: Symbol.for("DeleteAllCustomerUseCase"),
};
