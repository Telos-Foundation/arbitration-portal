import { put, takeEvery, select } from 'redux-saga/effects';
import { ActionTypes }    from 'const';

import * as actions from './actions';
import { AuthenticationSelectors, CasesSelectors, ClaimsSelectors } from '../selectors';
import { CasesActions, ClaimsActions } from '../actions';

export function* finishAction() {

  yield put(actions.setAction(null));
  yield put(actions.setActionLoading(false));
  yield put(CasesActions.setSelectedCase(null));
  yield put(ClaimsActions.setSelectedClaim(null));

}

export function* executeAction({ actionName, actionData }) {

  yield put(actions.setActionLoading(true));

  const account = yield select(AuthenticationSelectors.account);
  if(!account) throw new Error('Must be logged in first to execute action');

  const arbitrationContract = yield select(AuthenticationSelectors.arbitrationContract);
  const casefile = yield select(CasesSelectors.getSelectedCase);
  const claim = yield select(ClaimsSelectors.getSelectedClaim);

  switch(actionName) {
    case 'filecase': {

      const casefileData = {
        claimant: account.name,
        claim_link: actionData.claim_link,
        lang_codes: actionData.lang_codes,
        respondant: actionData.respondant,
      };
      yield arbitrationContract.fileCase(casefileData);

      break;
    }
    case 'shredcase': {

      const data = {
        case_id: casefile.case_id,
        claimant: account.name,
      };

      yield arbitrationContract.shredCase(data);
      break;
    }
    case 'readycase': {

      const data = {
        case_id: casefile.case_id,
        claimant: account.name,
      };
      yield arbitrationContract.readyCase(data);
      break;

    }
    case 'addclaim': {

      const addClaimData = {
        case_id: casefile.case_id,
        claimant: account.name,
        claim_link: actionData.claim_link,
      };
      yield arbitrationContract.addClaim(addClaimData);
      break;
    }
    case 'removeclaim': {

      const data = {
        claimant: account.name,
        case_id: casefile.case_id,
        claim_hash: claim.claim_summary,
      };
      yield arbitrationContract.removeClaim(data);
      break;

    }
    case 'respondclaim': {

      const data = {
        case_id: casefile.case_id,
        claim_hash: claim.claim_summary,
        respondant: account.name,
        response_link: actionData.response_link,
      };
      yield arbitrationContract.respondClaim(data);
      break;

    }
    case 'submitcasefile': {

      const account = yield select(AuthenticationSelectors.account);
      if(!account) throw new Error('Must be logged in first to execute action');

      const arbitrationContract = yield select(AuthenticationSelectors.arbitrationContract);
      const balance = yield arbitrationContract.getAccountBalance(account.name);

      if(parseFloat(balance.value) < 100) {
        yield arbitrationContract.deposit(account.name);
      }

      const data = {
        case_id: casefile.case_id,
        claimant: account.name,
      };
      yield arbitrationContract.readyCase(data);
      break;

    }
    default: {
      throw new Error(`Unknown action ${actionName}`);
    }
  }

  yield finishAction();
  yield put(CasesActions.fetchCases());

}

export default function* casesSaga() {

  yield takeEvery(ActionTypes.EXECUTE_ACTION, executeAction);

}