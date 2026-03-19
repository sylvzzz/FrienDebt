import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function Homepage() {
  const [userData, setUserData] = useState({ nome: "", email: "", total: 0 });
  const [dividas, setDividas] = useState([]);

  useEffect(() => {
    fetchUserData();
    loadDividas();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch("/userdata", { method: "POST" });
      if (!res.ok) { window.location.href = "/login"; return; }
      const data = await res.json();
      setUserData({
        nome: data.nome,
        email: data.email,
        total: typeof data.total === "number" ? data.total : 0,
      });
    } catch (err) {
      console.error("Erro ao obter dados:", err);
      window.location.href = "/login";
    }
  };

  const loadDividas = async () => {
    try {
      const res = await fetch("/balance", { method: "POST" });
      const data = await res.json();
      setDividas(data);
    } catch (err) {
      console.error("Erro ao carregar dívidas:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white font-sans">
      <Navbar userData={userData} activePage="home" />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Boas-vindas */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">
            Bem-Vindo,{" "}
            <span className="text-indigo-400">{userData.nome || "..."}</span>
          </h1>
        </div>

        {/* Saldo */}
        <Card className="bg-[#0d0d0f] border-gray-700 mb-8">
          <CardContent className="flex items-center justify-between py-6">
            <div>
              <p className="text-sm text-gray-400">Saldo total</p>
              <p
                className={`text-3xl font-bold mt-1 ${
                  userData.total >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                €{Number(userData.total).toFixed(2)}
              </p>
            </div>
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
              <a href="/post">+ Nova Dívida</a>
            </Button>
          </CardContent>
        </Card>

        {/* Tabela de dívidas */}
        <Card className="bg-[#0d0d0f] border-gray-700">
          <CardHeader className="border-b border-gray-800">
            <CardTitle className="text-white text-lg">
              Dívidas Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {dividas.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                Sem dívidas pendentes...
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-gray-800">
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-400 uppercase text-xs">A dever</TableHead>
                    <TableHead className="text-gray-400 uppercase text-xs">A pagar</TableHead>
                    <TableHead className="text-gray-400 uppercase text-xs text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dividas.map((divida, index) => (
                    <TableRow
                      key={divida.id ?? index}
                      className="border-gray-800 hover:bg-gray-800 transition-colors"
                    >
                     <TableCell className="text-white">
                      {divida.email_pagador === userData.email ? "Eu" : divida.nome_pagador}
                    </TableCell>
                    <TableCell className="text-white">
                      {divida.email_cobrador === userData.email ? "Eu" : divida.nome_cobrador}
                    </TableCell>
                    <TableCell className="text-right">
                        <Badge
                          variant="outline"
                          className={
                            divida.email_cobrador === userData.email
                              ? "border-emerald-500 text-emerald-400"
                              : "border-red-500 text-red-400"
                          }
                        >
                          {divida.email_cobrador !== userData.email ? "-" : ""}
                          €{Number(divida.valor).toFixed(2)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default Homepage;