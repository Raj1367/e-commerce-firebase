import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  searchQuery: string;
  categoryFilter: string;
  sortByPrice: 'asc' | 'desc' | null;
}

const initialState: FilterState = {
  searchQuery: '',
  categoryFilter: '',
  sortByPrice: null,
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string>) => {
      state.categoryFilter = action.payload;
    },
    setSortByPrice: (state, action: PayloadAction<'asc' | 'desc' | null>) => {
      state.sortByPrice = action.payload;
    },
  },
});

export const { setSearchQuery, setCategoryFilter, setSortByPrice } = filterSlice.actions;
export default filterSlice.reducer;
