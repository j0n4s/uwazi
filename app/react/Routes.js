import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from 'app/App/App';
import NoMatch from 'app/App/NoMatch';

import Login from 'app/Users/Login';
import ResetPassword from 'app/Users/ResetPassword';

import {
  Settings,
  AccountSettings,
  CollectionSettings,
  NavlinksSettings,
  DocumentTypesList,
  EntityTypesList,
  RelationTypesList,
  ThesaurisList,
  TranslationsList,
  FiltersForm,
  Languages,
  Customisation,
  CustomUploads
} from 'app/Settings';

import Pages from 'app/Pages/Pages';
import NewPage from 'app/Pages/NewPage';
import EditPage from 'app/Pages/EditPage';
import PageView from 'app/Pages/PageView';

import { Users, NewUser, EditUser } from 'app/Users';

import ViewDocument from 'app/Viewer/ViewDocument';
import EntityView from 'app/Entities/EntityView';
import Uploads from 'app/Uploads/UploadsRoute';

import EditTemplate from 'app/Templates/EditTemplate';
import EditEntity from 'app/Templates/EditEntity';
import NewTemplate from 'app/Templates/NewTemplate';
import NewEntity from 'app/Templates/NewEntity';

import EditThesauri from 'app/Thesauris/EditThesauri';
import NewThesauri from 'app/Thesauris/NewThesauri';

import EditRelationType from 'app/RelationTypes/EditRelationType';
import NewRelationType from 'app/RelationTypes/NewRelationType';

import EditTranslations from 'app/I18N/EditTranslations';

import Library from 'app/Library/Library';
import LibraryMap from 'app/Library/LibraryMap';
import { trackPage } from 'app/App/GoogleAnalytics';
import { store } from './store';

function onEnter() {
  trackPage();
}

function getIndexRoute(nextState, callBack) {
  const indexRoute = {
    component: Library,
    onEnter: (nxtState, replace) => {
      const collectionSettings = store.getState().settings.collection.toJS();
      if (collectionSettings.home_page) {
        replace(collectionSettings.home_page);
      }
    }
  };
  callBack(null, indexRoute);
}

const routes = (
  <Route getIndexRoute={getIndexRoute}>
    <Route path="settings" component={Settings}>
      <Route path="account" component={AccountSettings} />
      <Route path="collection" component={CollectionSettings} />
      <Route path="navlinks" component={NavlinksSettings} />
      <Route path="users">
        <IndexRoute component={Users} />
        <Route path="new" component={NewUser} />
        <Route path="edit/:userId" component={EditUser} />
      </Route>
      <Route path="pages">
        <IndexRoute component={Pages} />
        <Route path="new" component={NewPage} />
        <Route path="edit/:pageId" component={EditPage} />
      </Route>
      <Route path="documents">
        <IndexRoute component={DocumentTypesList} />
        <Route path="new" component={NewTemplate} />
        <Route path="edit/:templateId" component={EditTemplate} />
      </Route>
      <Route path="entities">
        <IndexRoute component={EntityTypesList} />
        <Route path="new" component={NewEntity} />
        <Route path="edit/:templateId" component={EditEntity} />
      </Route>
      <Route path="connections">
        <IndexRoute component={RelationTypesList} />
        <Route path="new" component={NewRelationType} />
        <Route path="edit/:relationTypeId" component={EditRelationType} />
      </Route>
      <Route path="dictionaries">
        <IndexRoute component={ThesaurisList} />
        <Route path="new" component={NewThesauri} />
        <Route path="edit/:thesauriId" component={EditThesauri} />
      </Route>
      <Route path="languages" component={Languages}/>
      <Route path="translations">
        <IndexRoute component={TranslationsList} />
        <Route path="edit/:context" component={EditTranslations} />
      </Route>
      <Route path="filters" component={FiltersForm} />
      <Route path="customisation" component={Customisation} />
      <Route path="custom-uploads" component={CustomUploads} />
    </Route>
    <Route path="library" component={Library} onEnter={onEnter}/>
    <Route path="library/map" component={LibraryMap} onEnter={onEnter}/>
    <Route path="uploads" component={Uploads} />
    <Route path="login" component={Login} />
    <Route path="setpassword/:key" component={ResetPassword} />
    <Route path="document/:documentId*" component={ViewDocument} onEnter={onEnter}/>
    <Route path="entity/:entityId" component={EntityView} onEnter={onEnter}/>
    <Route path="page/:pageId" component={PageView} onEnter={onEnter}/>
    <Route path="404" component={NoMatch} />
  </Route>
);

export default (
  <Route path="/" component={App}>
    {routes}
    <Route path=":lang">
      {routes}
      <Route path="*" component={NoMatch} />
    </Route>
    <Route path="*" component={NoMatch} />
  </Route>
);
