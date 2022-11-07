import { GetServerSideProps } from "next";
import Image from "next/image";
import appPreviewImage from "../assets/app-nlw-copa-preview.png";
import usersAvatarExempleImg from "../assets/users-avatar-example.png";
import logoImg from "../assets/logo.svg";
import iconCheckImg from "../assets/icon-check.svg";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home({ poolCount, guessCount, userCount }: HomeProps) {
  const [poolTitle, setPoolTitle] = useState("");

  async function createPool(e: FormEvent) {
    e.preventDefault();
    try {
      const response = await api.post("/pools", {
        title: poolTitle,
      });

      const { code } = response.data;

      await navigator.clipboard.writeText(code);

      setPoolTitle("");

      alert(
        "Bolão criado com sucesso! Código copiado para a área de transferência!"
      );
    } catch (error) {
      console.log(error);
      alert("Erro ao criar pool");
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28">
      <main>
        <Image src={logoImg} alt="logo nlw-copa" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe com os amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image
            src={usersAvatarExempleImg}
            alt="avatares de usuários do app nlw-copa"
          />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500 mx-2">+{userCount}</span>pessoas já
            estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            required
            placeholder="Qual o nome do seu bolão?"
            value={poolTitle}
            onChange={(e) => setPoolTitle(e.target.value)}
          />
          <button
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão você receberá um código único que poderá usar
          para convidar seu amigos para participar
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex item-center gap-6">
            <Image src={iconCheckImg} alt="Check icon" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600" />

          <div className="flex item-center gap-6">
            <Image src={iconCheckImg} alt="Check icon" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImage}
        alt="Dois celulares com previews do app nlw-copa"
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const [pools, guesses, users] = await Promise.all([
    api.get("pools/count"),
    api.get("guesses/count"),
    api.get("users/count"),
  ]);

  console.log(users.data.count);

  return {
    props: {
      poolCount: pools.data.count,
      guessCount: guesses.data.count,
      userCount: users.data.count,
    },
  };
};
