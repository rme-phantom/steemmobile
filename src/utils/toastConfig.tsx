import { MD2Colors } from "react-native-paper";
import { ErrorToast, InfoToast, BaseToast } from "react-native-toast-message";
import { AppColors } from "../constants/AppColors";

export const toastConfig = {
    error: (props) => (
        <ErrorToast
            {...props}
            style={{ borderLeftColor: AppColors.RED, backgroundColor: MD2Colors.red200 }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                color: AppColors.WHITE,
                fontSize: 14


            }}
            text2Style={{
                color: AppColors.WHITE,
                fontSize: 12

            }}
            text2NumberOfLines={10}

        />
    ),
    info: (props) => (
        <InfoToast
            {...props}
            style={{ borderLeftColor: MD2Colors.blue600, backgroundColor: MD2Colors.blue200 }}
            contentContainerStyle={{ paddingHorizontal: 15 }}

            text1Style={{
                color: AppColors.BLACK,
                fontSize: 14


            }}
            text2Style={{
                color: AppColors.BLACK,
                fontSize: 12

            }}
            text2NumberOfLines={3}
        />
    ),
    success: (props) => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: MD2Colors.green800,
                backgroundColor: MD2Colors.green200
            }}
            contentContainerStyle={{ paddingHorizontal: 15 }}

            text1Style={{
                color: AppColors.BLACK,
                fontSize: 14

            }}
            text2Style={{
                color: AppColors.BLACK,
                fontSize: 12
            }}

        />
    ),


};
