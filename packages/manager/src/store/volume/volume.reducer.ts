import { Volume } from 'linode-js-sdk/lib/volumes';
import { pathOr } from 'ramda';
import { Reducer } from 'redux';
import { MappedEntityState } from 'src/store/types';
import { isType } from 'typescript-fsa';
import {
  createDefaultState,
  onCreateOrUpdate,
  onDeleteSuccess,
  onError,
  onGetAllSuccess,
  onStart
} from '../store.helpers';
import {
  createVolumeActions,
  deleteVolumeActions,
  getAllVolumesActions,
  getOneVolumeActions,
  updateVolumeActions
} from './volume.actions';

import { EntityError } from 'src/store/types';
import { getAPIErrorOrDefault } from 'src/utilities/errorUtils';

export type State = MappedEntityState<Volume, EntityError>;

export const defaultState: State = createDefaultState<Volume, EntityError>({
  error: {
    create: undefined,
    update: undefined,
    delete: undefined,
    read: undefined
  }
});

const reducer: Reducer<State> = (state = defaultState, action) => {
  /*
   * Create Volume
   **/
  if (isType(action, createVolumeActions.done)) {
    const { result } = action.payload;
    return onCreateOrUpdate<Volume, EntityError>(result, state);
  }
  if (isType(action, createVolumeActions.failed)) {
    const { error } = action.payload;
    return onError<MappedEntityState<Volume, EntityError>, EntityError>(
      {
        create: getAPIErrorOrDefault(error)
      },
      state
    );
  }

  /*
   * Update Volume
   **/
  if (isType(action, updateVolumeActions.done)) {
    const { result } = action.payload;
    return onCreateOrUpdate<Volume, EntityError>(result, state);
  }
  if (isType(action, updateVolumeActions.failed)) {
    const { error } = action.payload;
    return onError<MappedEntityState<Volume, EntityError>, EntityError>(
      {
        update: getAPIErrorOrDefault(error)
      },
      state
    );
  }

  /*
   * Delete Volume
   **/
  if (isType(action, deleteVolumeActions.done)) {
    const { params } = action.payload;
    return onDeleteSuccess<Volume, EntityError>(params.volumeId, state);
  }
  if (isType(action, deleteVolumeActions.failed)) {
    const { error } = action.payload;
    return onError<MappedEntityState<Volume, EntityError>, EntityError>(
      {
        delete: getAPIErrorOrDefault(error)
      },
      state
    );
  }

  /*
   * Get One Volume
   */
  if (isType(action, getOneVolumeActions.done)) {
    const { result } = action.payload;
    return onCreateOrUpdate<Volume, EntityError>(result, state);
  }

  /*
   * Get All Volumes
   **/
  if (isType(action, getAllVolumesActions.started)) {
    const shouldSetLoading = pathOr(
      true,
      ['payload', 'shouldSetLoading'],
      action
    );
    if (shouldSetLoading) {
      return onStart<MappedEntityState<Volume, EntityError>>(state);
    }
  }
  if (isType(action, getAllVolumesActions.done)) {
    const { result } = action.payload;
    return onGetAllSuccess<Volume, MappedEntityState<Volume, EntityError>>(
      result,
      state
    );
  }
  if (isType(action, getAllVolumesActions.failed)) {
    const { error } = action.payload;
    return onError<MappedEntityState<Volume, EntityError>, EntityError>(
      {
        read: getAPIErrorOrDefault(error)
      },
      state
    );
  }

  return state;
};

export default reducer;
