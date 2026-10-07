(function () {
  var host = document.getElementById('codes');
  if (!host || host.dataset.ready) return;
  host.dataset.ready = 'true';
  var original = [
    { id: 'af', term: 'Atrial fibrillation', code: '49436004', confidence: 97, source: 'ECG today confirmed atrial fibrillation' },
    { id: 't2', term: 'Type 2 diabetes mellitus', code: '44054006', confidence: 96, source: 'background of type 2 diabetes mellitus' },
    { id: 'ht', term: 'Essential hypertension', code: '59621000', confidence: 93, source: 'and essential hypertension' },
    { id: 'lvh', term: 'Left ventricular hypertrophy', code: '55827005', confidence: 74, source: 'mild left ventricular hypertrophy' }
  ];
  var rows, editing = null, filed = false;
  function reset() { rows = original.map(function (x) { return Object.assign({}, x, { status: 'pending', reason: '' }); }); editing = null; filed = false; }
  function el(tag, text, cls) { var node = document.createElement(tag); if (text) node.textContent = text; if (cls) node.className = cls; return node; }
  function action(label, row, fn) {
    var b = el('button', label); b.type = 'button'; b.dataset.action = label; b.dataset.row = row.id;
    b.addEventListener('click', fn); return b;
  }
  function focusRow(id) { var n = host.querySelector('[data-row="' + id + '"]'); if (n) n.focus(); }
  function draw() {
    host.replaceChildren();
    rows.forEach(function (row, index) {
      var card = el('article', '', 'review-card'); card.setAttribute('aria-label', row.term);
      card.append(el('h3', row.term), el('p', 'SCTID ' + row.code + ' · from “' + row.source + '”'), el('p', row.confidence + '% · ' + (row.confidence >= 90 ? 'High confidence' : 'Borderline: review closely'), 'review-confidence'));
      var buttons = el('div', '', 'review-actions');
      if (editing === row.id) {
        var form = el('form', '', 'amend-form');
        var fields = {};
        [['term', 'Suggested term', row.term], ['code', 'SNOMED CT UK code', row.code], ['reason', 'Reason for amendment', row.reason]].forEach(function (spec) {
          var label = el('label', spec[1]), input = el('input'); input.name = spec[0]; input.value = spec[2]; input.required = true;
          input.maxLength = spec[0] === 'code' ? 18 : 240;
          if (spec[0] === 'code') { input.pattern = '[0-9]{6,18}'; input.inputMode = 'numeric'; input.title = 'Enter a code containing 6 to 18 digits.'; }
          label.append(input); form.append(label); fields[spec[0]] = input;
        });
        form.append(el('p', 'Illustrative editing only. Codes are not checked against the SNOMED catalogue in this demonstration.', 'review-note'));
        var save = el('button', 'Save amendment'); save.type = 'submit';
        form.append(save, action('Cancel', row, function () { editing = null; draw(); focusRow(row.id); }));
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var invalid = Object.values(fields).find(function (field) { return !field.value.trim(); });
          if (invalid) { invalid.setCustomValidity('Please enter a value.'); invalid.reportValidity(); invalid.addEventListener('input', function () { invalid.setCustomValidity(''); }, { once: true }); return; }
          row.term = fields.term.value.trim(); row.code = fields.code.value.trim(); row.reason = fields.reason.value.trim(); row.status = 'amended'; editing = null; filed = false; draw(); focusRow(row.id);
        });
        card.append(form);
      } else if (row.status === 'pending') {
        [['Accept', 'accepted'], ['Amend', 'amended'], ['Reject', 'rejected']].forEach(function (spec) {
          buttons.append(action(spec[0], row, function () { if (spec[0] === 'Amend') editing = row.id; else row.status = spec[1]; filed = false; draw(); if (editing) host.querySelector('input').focus(); else focusRow(row.id); }));
        });
      } else {
        card.append(el('p', row.status === 'amended' ? 'Amended: ' + row.reason : row.status === 'accepted' ? 'Accepted' : 'Rejected', 'review-status'));
        buttons.append(action('Undo', row, function () { rows[index] = Object.assign({}, original[index], { status: 'pending', reason: '' }); filed = false; draw(); focusRow(row.id); }));
      }
      card.append(buttons); host.append(card);
    });
    var count = rows.filter(function (r) { return r.status !== 'pending'; }).length;
    document.getElementById('reviewed').textContent = count + ' of 4 reviewed';
    document.getElementById('notAll').hidden = count === 4;
    document.getElementById('canFile').hidden = count !== 4 || filed;
    document.getElementById('filed').hidden = !filed;
    document.getElementById('filedText').textContent = 'Example complete: ' + rows.filter(function (r) { return r.status !== 'rejected'; }).length + ' codes selected. No real patient record was updated.';
  }
  document.getElementById('fileBtn').addEventListener('click', function () { if (rows.every(function (r) { return r.status !== 'pending'; })) { filed = true; draw(); document.getElementById('resetBtn').focus(); } });
  document.getElementById('resetBtn').addEventListener('click', function () { reset(); draw(); focusRow(rows[0].id); });
  reset(); draw();
})();
