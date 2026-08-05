import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function UpdatePassword() {

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {

    e.preventDefault();

    if (password !== confirm) {

      setMessage("Las contraseñas no coinciden.");

      return;

    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({

      password,

    });

    setLoading(false);

    if (error) {

      setMessage(error.message);

      return;

    }

    setMessage("✅ Contraseña actualizada correctamente.");

    setTimeout(() => {

      navigate("/");

    }, 1500);

  };

  return (

    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >

      <form
        onSubmit={handleUpdate}
        style={{
          width: "400px",
          background: "#1f2937",
          padding: "40px",
          borderRadius: "20px",
        }}
      >

        <h1>Cambiar contraseña</h1>

        <p>Ingresa una nueva contraseña.</p>

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        />

        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
          }}
        >
          {loading ? "Guardando..." : "Guardar contraseña"}
        </button>

        {message && (

          <p
            style={{
              marginTop: "20px",
            }}
          >
            {message}
          </p>

        )}

      </form>

    </main>

  );

}