// Define your interfaces here
export type IEmployeeFilterRequest = {
  searchTerm?: string | undefined;
  id?: string | undefined;
  zoneId?: string | undefined;
  types?: string | undefined;
  joiningDate?: string | undefined;
};
