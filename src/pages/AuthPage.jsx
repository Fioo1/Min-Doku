import { useState } from "react";
import { Navigate } from "react-router-dom";
import {
  ArrowLeft,
  KeyRound,
  Sparkles,
  Eye,
  EyeOff,
  Mail,
  Lock,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const {
    user,
    signIn,
    signUp,
    resetPassword,
    configured,
  } = useAuth();

  const [mode, setMode] = useState("login");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const isRecoveryPage =
    window.location.pathname === "/update-password";

  if (user && !isRecoveryPage) {
    return <Navigate to="/" replace />;
  }

  const update = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const submit = async (event) => {
    event.preventDefault();

    setMessage("");
    setBusy(true);

    try {
      if (mode === "login") {
        await signIn({
          email: form.email,
          password: form.password,
        });
      }

      if (mode === "register") {
        if (form.password !== form.confirmPassword) {
          setMessage("Las contraseñas no coinciden.");
          setBusy(false);
          return;
        }

        await signUp({
          name: form.name,
          email: form.email,
          password: form.password,
        });

        setMessage("Cuenta creada correctamente.");
      }

      if (mode === "reset") {
        await resetPassword(form.email);

        setMessage(
          "Te enviamos un enlace para restablecer tu contraseña."
        );
      }
    } catch (error) {
      setMessage(
        error.message || "No pudimos completar la acción."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-copy">
        <div className="auth-logo">
          <span>m</span>
          MinDoku
        </div>

        <p className="eyebrow">
          JUEGA. PROGRESA. DOMINA.
        </p>

        <h1>
          Tu próxima
          <br />
          <em>victoria</em>
          <br />
          empieza aquí.
        </h1>

        <p>
          Sudokus ilimitados, progreso real y desafíos hechos
          para mantener tu mente en forma.
        </p>

        <Sparkles className="auth-spark" />
      </section>

      <section className="auth-form-wrap">
        <form
          className="auth-form"
          onSubmit={submit}
        >
          {mode !== "reset" && (
            <div className="auth-tabs">
              <button
                type="button"
                className={mode === "login" ? "selected" : ""}
                onClick={() => setMode("login")}
              >
                Entrar
              </button>

              <button
                type="button"
                className={mode === "register" ? "selected" : ""}
                onClick={() => setMode("register")}
              >
                Crear cuenta
              </button>
            </div>
          )}

          <h2>
            {mode === "login"
              ? "Qué bueno verte"
              : mode === "register"
              ? "Crea tu perfil"
              : "Recupera tu acceso"}
          </h2>

          <p>
            {mode === "reset"
              ? "Te enviaremos un enlace seguro a tu correo."
              : "Continúa tu aventura en MinDoku."}
          </p>

          {!configured && (
            <p className="auth-error">
              Faltan las variables de Supabase en Vercel.
            </p>
          )}

          {mode === "register" && (
            <label>
              Nombre

              <input
                name="name"
                value={form.name}
                onChange={update}
                required
                placeholder="Tu nombre"
              />
            </label>
          )}

          {mode === "login" ? (

            <div className="login-input">

              <Mail
                size={18}
                className="left-icon"
              />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={update}
                required
                placeholder="Correo electrónico"
              />

            </div>

          ) : (

            <label>

              Correo electrónico

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={update}
                required
                placeholder="correoelectronico@gmail.com"
              />

            </label>

          )}

          {mode !== "reset" && (

            mode === "login" ? (

              <div className="login-input">

                <Lock
                  size={18}
                  className="left-icon"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={update}
                  required
                  placeholder="Contraseña"
                />

                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >

                  {showPassword ? (
                    <EyeOff size={18}/>
                  ) : (
                    <Eye size={18}/>
                  )}

                </button>

              </div>

            ) : (

              <>

                <label>

                  Contraseña

                  <div className="password-field">

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={update}
                      required
                      minLength={6}
                      placeholder="Mínimo 6 caracteres"
                    />

                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >

                      {showPassword ? (
                        <EyeOff size={18}/>
                      ) : (
                        <Eye size={18}/>
                      )}

                    </button>

                  </div>

                </label>

                <label>

                  Confirmar contraseña

                  <div className="password-field">

                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={update}
                      required
                      minLength={6}
                      placeholder="Repite tu contraseña"
                    />

                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >

                      {showConfirmPassword ? (
                        <EyeOff size={18}/>
                      ) : (
                        <Eye size={18}/>
                      )}

                    </button>
                  </div>
                </label>
              </>
            )
          )}

          <button
            className="auth-submit"
            disabled={busy || !configured}
          >
            {busy
              ? "Un momento..."
              : mode === "login"
              ? "Entrar a MinDoku"
              : mode === "register"
              ? "Crear mi cuenta"
              : "Enviar enlace"}
          </button>

          {mode === "login" && (
            <button
              className="text-action"
              type="button"
              onClick={() => setMode("reset")}
            >
              <KeyRound size={16} />
              Olvidé mi contraseña
            </button>
          )}

          {mode === "reset" && (
            <button
              className="text-action"
              type="button"
              onClick={() => setMode("login")}
            >
              <ArrowLeft size={16} />
              Volver a entrar
            </button>
          )}

          {message && (
            <p className="auth-message">
              {message}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}