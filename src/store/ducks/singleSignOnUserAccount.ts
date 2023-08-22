import { createAsyncThunk } from "@reduxjs/toolkit";
import { PartialSingleError, SingleSignOnError } from "types";
import { signInRedirectCallback } from "helpers/singleSingOn";
import { RootState } from "store";
import { OIDC_USERNAME_MAPPING } from "constants/settings";

// TODO: need to confirm that this still works
export const singleSignOnAction = createAsyncThunk<
  {
    token: string | undefined;
    email: string | undefined;
  },
  void,
  { rejectValue: PartialSingleError; state: RootState }
>("userAccount/singleSignOnAction", async (_, { rejectWithValue }): Promise<any> => {
  try {
    const response = await signInRedirectCallback();
    return {
      token: response.id_token,
      // TODO: SSO user email instead of username
      email: response.profile[OIDC_USERNAME_MAPPING],
    };
  } catch (error: unknown) {
    const err: SingleSignOnError = error as SingleSignOnError;
    return rejectWithValue({
      ...err,
    });
  }
});
