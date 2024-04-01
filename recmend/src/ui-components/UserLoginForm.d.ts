/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, PasswordFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type UserLoginFormInputValues = {
    Field0?: string;
    Field1?: string;
};
export declare type UserLoginFormValidationValues = {
    Field0?: ValidationFunction<string>;
    Field1?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type UserLoginFormOverridesProps = {
    UserLoginFormGrid?: PrimitiveOverrideProps<GridProps>;
    Field0?: PrimitiveOverrideProps<TextFieldProps>;
    Field1?: PrimitiveOverrideProps<PasswordFieldProps>;
} & EscapeHatchProps;
export declare type UserLoginFormProps = React.PropsWithChildren<{
    overrides?: UserLoginFormOverridesProps | undefined | null;
} & {
    onSubmit: (fields: UserLoginFormInputValues) => void;
    onChange?: (fields: UserLoginFormInputValues) => UserLoginFormInputValues;
    onValidate?: UserLoginFormValidationValues;
} & React.CSSProperties>;
export default function UserLoginForm(props: UserLoginFormProps): React.ReactElement;
