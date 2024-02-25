import React, {
  Fragment,
  useState,
  useContext,
  useMemo,
  useEffect,
} from "react";
import { PanemContext } from "../store/centralrecipes";
import { useTranslation } from "react-i18next";
import trashIcon from "../style/trash.svg";

const multiplication = (a, b) => {
  return a * b;
};

const Pieces = () => {
  const { recipedata, setTotaldemande, updateRecipeData } =
    useContext(PanemContext);

  const { t } = useTranslation();

  const [portions, setPortions] = useState(1);
  const [nbprd, setNbprd] = useState(1);
  const [newName, setNewName] = useState("");
  const [newWeight, setNewWeight] = useState(250);
  const [addPrd, setAddPrd] = useState(false);
  const [qtt, setQtt] = useState(recipedata);

  const total = useMemo(() => {
    let total =
      qtt && qtt.pieces
        ? qtt.pieces.reduce(
            (somme, piece) => somme + multiplication(piece.nombre, piece.poid),
            0
          )
        : 0;
    return total;
  }, [qtt]);

  // Chaque fois que recipedata est update, il faut mettre a jour le state.
  useEffect(() => {
    setQtt(recipedata);
    setTotaldemande(multiplication(portions, total));
  }, [recipedata, qtt, portions, setTotaldemande, total]);

  const handleNewName = (e) => {
    setNewName(e.target.value);
  };

  const handleNewWeight = (e) => {
    setNewWeight(e.target.value);
  };

  const suppr = (piece) => {
    for (var i = 0; i < qtt.pieces.length; i++) {
      if (qtt.pieces[i].titre === piece.titre) {
        qtt.pieces.splice(i, 1);
        break;
      }
    }
    updateRecipeData({ ...qtt });
  };

  const setNewprd = () => {
    let newprd = {
      nombre: nbprd,
      titre: newName,
      poid: newWeight,
    };
    qtt.pieces.push(newprd);
    setAddPrd(!addPrd);
    updateRecipeData({ ...qtt });
  };

  const changeQtt = (piece, direction) => {
    for (var i = 0; i < qtt.pieces.length; i++) {
      if (qtt.pieces[i].titre === piece.titre) {
        qtt.pieces[i].nombre = Math.max(0, qtt.pieces[i].nombre + direction);
        break;
      }
    }
    updateRecipeData({ ...qtt });
    // setQtt({ ...qtt });
  };

  const addPiece = () => {
    setAddPrd(!addPrd);
  };

  return (
    <Fragment>
      {qtt && (
        <section className="existing">
          <div className="pieces">
            <h2>{qtt.titre}</h2>
            <ul>
              {qtt.pieces.map((piece, i) => (
                <li key={i}>
                  <button onClick={() => changeQtt(piece, -1)}>-</button>
                  <b>{piece.nombre}</b>
                  <button onClick={() => changeQtt(piece, 1)}>+</button>
                  <span>
                    {`${piece.titre} de ${piece.poid}gr `}→{" "}
                    {multiplication(piece.nombre, piece.poid)}gr
                  </span>
                  <button
                    onClick={() => suppr(piece)}
                    className="supprimer"
                    title="retirer de la liste des produits"
                  >
                    <img width="15" src={trashIcon} alt={t("suppress")} />
                  </button>
                </li>
              ))}
              <li className="total">
                <b>{total}</b>gr
              </li>
              <li className="nombre">
                <button onClick={() => setPortions(portions - 1)}>-</button>
                <b>{portions}</b>
                <button onClick={() => setPortions(portions + 1)}>
                  +
                </button>→{" "}
                <b className="poidTotal">{multiplication(portions, total)}</b>gr
              </li>
              <li className={`${addPrd ? "hide" : "nopuce"}`}>
                <button onClick={() => addPiece()} className="bt">
                  {t("addAPiece")}
                </button>
              </li>
            </ul>
            <div className={`formAddPrd ${addPrd ? "" : "hide"}`}>
              <fieldset>
                <label>{t("labelItem")}</label>
                <input
                  type="text"
                  id="titlePieces"
                  value={newName}
                  onChange={handleNewName}
                ></input>
              </fieldset>
              <fieldset>
                <label>{t("weight")}</label>
                <input
                  value={newWeight}
                  type="number"
                  id="poidUnitee"
                  onChange={handleNewWeight}
                ></input>
              </fieldset>
              <fieldset>
                <label>{t("numberProducts")}</label>
                <button onClick={() => setNbprd(nbprd - 1)}>-</button>
                <b>{nbprd}</b>
                <button onClick={() => setNbprd(nbprd + 1)}>+</button>
              </fieldset>
              <div className="submitBt">
                <input
                  onClick={() => setNewprd()}
                  type="submit"
                  className="submit"
                  value={t("add")}
                />
                <span onClick={() => setAddPrd(false)}>{t("annuler")}</span>
              </div>
            </div>
          </div>
        </section>
      )}
    </Fragment>
  );
};

export default Pieces;
