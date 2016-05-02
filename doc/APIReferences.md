# Dessin JSXGraph API References

### x.x inputbox

L'inputbox accepte deux parametre `label` qui est le titre du input, et `type` qui est le type du input (par defaut `"text"`).

Il renvoie un `$.Deferred().promise()` objet, qui `done` avec le valeur du input, et `fail` avec un message de error.

Pour les informations sur `$.Deferred()` objet, voyez sur le document de jQuery.

Un exemple est,

```javascript
$.when(self.inputbox("Entrer un nom : "))
					.done(function (nom) {
						element.name = nom;
						self.brd.update()
					})
					.fail(function (err) {
						alert(err)
					})
```

