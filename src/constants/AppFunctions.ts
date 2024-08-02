import {TypedUseSelectorHook, useSelector} from 'react-redux';
import {RootState} from '../redux/store/store';

export const AppFunctions = {
  MapSDS: function MapSDSResponse(response: any) {
    const result = response.result;
    if (!result) {
      return response;
    }

    const {cols, rows} = result;
    if (!cols) {
      return rows || result;
    }

    const keys = Object.keys(cols);
    const mapped_data: any[] = [];

    result.rows.forEach(row => {
      const values: any = Object.values(row);
      const mapped = values.reduce(
        (a, it, index) => ({...a, [keys[index]]: it}),
        {},
      );
      mapped_data.push(mapped);
    });

    return mapped_data;
  },
  ValidateSDS: function validateSds(result: any) {
    return result.code === 0;
  },
};

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
