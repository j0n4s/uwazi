import evidences from './evidences';
import searchEvidences from './searchEvidences';
import MLAPI from './MLAPI';
import needsAuthorization from '../auth/authMiddleware';

export default (app) => {
  app.post('/api/evidences', needsAuthorization(['admin', 'editor']), (req, res) => {
    return evidences.save(req.body, req.user, req.language)
    .then(response => {
      MLAPI.train(req.body);
      return res.json(response);
    })
    .catch(res.error);
  });

  app.post('/api/evidences/retrainModel', needsAuthorization(['admin', 'editor']), (req, res) => {
    return evidences.retrainModel(req.body.property, req.body.value)
    .then(response => {
      return res.json(response);
    })
    .catch(res.error);
  });

  app.post('/api/evidences/get_suggestions_property_value', needsAuthorization(['admin', 'editor']), (req, res) => {
    return evidences.getSuggestionsForOneValue(req.body.property, req.body.value, req.language)
    .then(response => {
      return res.json(response);
    })
    .catch(res.error);
  });

  app.get('/api/evidences/suggestions', needsAuthorization(['admin', 'editor']), (req, res) => {
    return evidences.getSuggestions(req.query._id, req.language)
    .then(response => res.json(response))
    .catch(res.error);
  });

  //
  app.get('/api/evidences/search', (req, res) => {
    let filters = {};
    if (req.query.filters) {
      filters = JSON.parse(req.query.filters);
    }
    return searchEvidences.search(filters, req.query.limit)
    .then(response => res.json(response))
    .catch(res.error);
  });
  //

  app.get('/api/evidences', (req, res) => {
    let query = req.query;
    query.language = req.language;
    evidences.get(query)
    .then(response => res.json(response))
    .catch(res.error);
  });
};
