#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gerenciador de Curiosidades do SP500 Dashboard
Edite e atualize as curiosidades diárias facilmente!
"""

import json
import os
from datetime import datetime
from pathlib import Path


class GerenciadorCuriosidades:
    def __init__(self, arquivo_json="curiosidades.json"):
        """Inicializar gerenciador"""
        self.arquivo = arquivo_json
        self.dados = self.carregar()
    
    def carregar(self):
        """Carregar dados do JSON"""
        try:
            with open(self.arquivo, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"❌ Arquivo não encontrado: {self.arquivo}")
            return {"curiosidades": [], "configuracao": {}}
        except json.JSONDecodeError:
            print(f"❌ Erro ao ler JSON: {self.arquivo}")
            return {"curiosidades": [], "configuracao": {}}
    
    def salvar(self):
        """Salvar dados no JSON"""
        try:
            with open(self.arquivo, 'w', encoding='utf-8') as f:
                json.dump(self.dados, f, ensure_ascii=False, indent=2)
            print(f"✅ Arquivo salvo: {self.arquivo}")
            return True
        except Exception as e:
            print(f"❌ Erro ao salvar: {e}")
            return False
    
    def listar_curiosidades(self):
        """Listar todas as curiosidades"""
        curiosidades = self.dados.get('curiosidades', [])
        
        if not curiosidades:
            print("📭 Nenhuma curiosidade registrada")
            return
        
        print("\n" + "=" * 80)
        print("📚 CURIOSIDADES REGISTRADAS")
        print("=" * 80 + "\n")
        
        for i, c in enumerate(curiosidades, 1):
            print(f"{i}. [{c.get('posicao')}] {c.get('simbolo')} - {c.get('empresa')}")
            print(f"   Setor: {c.get('setor')}")
            print(f"   Div. Yield: {c.get('dividendYield')}")
            print()
    
    def adicionar_curiosidade(self):
        """Adicionar nova curiosidade"""
        print("\n" + "=" * 80)
        print("➕ ADICIONAR NOVA CURIOSIDADE")
        print("=" * 80 + "\n")
        
        # Gerar novo ID
        novo_id = max([c.get('id', 0) for c in self.dados.get('curiosidades', [])], default=0) + 1
        
        print("📝 Preencha os dados abaixo:\n")
        
        posicao = input("Posição (ex: 1º): ").strip()
        simbolo = input("Símbolo da Empresa (ex: AAPL): ").strip().upper()
        empresa = input("Nome da Empresa: ").strip()
        setor = input("Setor: ").strip()
        titulo = input("Título da Curiosidade: ").strip()
        
        print("\n📄 Descrição (pressione Enter 2x quando terminar):")
        linhas_descricao = []
        while True:
            linha = input()
            if linha == "":
                if linhas_descricao and linhas_descricao[-1] == "":
                    break
                linhas_descricao.append(linha)
            else:
                linhas_descricao.append(linha)
        descricao = "\n".join(linhas_descricao[:-1])
        
        print("\n📌 Fatos Principais (uma por linha, Enter vazio ao terminar):")
        fatos = []
        while True:
            fato = input(f"Fato {len(fatos) + 1}: ").strip()
            if not fato:
                break
            fatos.append(fato)
        
        print("\n💡 Insight para Investidores:")
        insight = input().strip()
        
        dividendYield = input("\nDiv. Yield (ex: 2.15%): ").strip()
        marketCap = input("Market Cap (ex: $32.5B): ").strip()
        link = input("Link do site oficial: ").strip()
        imagem = input("URL da imagem (opcional): ").strip()
        
        # Criar curiosidade
        nova_curiosidade = {
            "id": novo_id,
            "posicao": posicao,
            "simbolo": simbolo,
            "empresa": empresa,
            "setor": setor,
            "dataAdicao": datetime.now().strftime("%Y-%m-%d"),
            "titulo": titulo,
            "descricao": descricao,
            "fatos": fatos,
            "dividendYield": dividendYield,
            "marketCap": marketCap,
            "insight": insight,
            "link": link,
            "imagem": imagem or f"https://via.placeholder.com/400x300?text={empresa.replace(' ', '+')}"
        }
        
        self.dados['curiosidades'].append(nova_curiosidade)
        self.salvar()
        
        print(f"\n✅ Curiosidade adicionada com sucesso!")
        print(f"   ID: {novo_id}")
        print(f"   Empresa: {empresa}")
    
    def editar_curiosidade(self):
        """Editar curiosidade existente"""
        self.listar_curiosidades()
        
        curiosidades = self.dados.get('curiosidades', [])
        if not curiosidades:
            return
        
        print("\n" + "=" * 80)
        print("✏️ EDITAR CURIOSIDADE")
        print("=" * 80 + "\n")
        
        try:
            indice = int(input("Número da curiosidade a editar: ")) - 1
            if indice < 0 or indice >= len(curiosidades):
                print("❌ Opção inválida")
                return
        except ValueError:
            print("❌ Digite um número válido")
            return
        
        curiosidade = curiosidades[indice]
        
        print(f"\n🔧 Editando: {curiosidade.get('empresa')}")
        print("(Deixe em branco para manter o valor atual)\n")
        
        # Campos editáveis
        campos = {
            'titulo': 'Título',
            'descricao': 'Descrição',
            'dividendYield': 'Div. Yield',
            'marketCap': 'Market Cap',
            'insight': 'Insight',
            'link': 'Link',
            'imagem': 'URL da Imagem'
        }
        
        for chave, label in campos.items():
            valor_atual = curiosidade.get(chave, '')
            novo_valor = input(f"{label} [{valor_atual}]: ").strip()
            if novo_valor:
                curiosidade[chave] = novo_valor
        
        # Editar fatos
        print("\n📌 Fatos Principais (deixe em branco para manter):")
        fatos_atuais = curiosidade.get('fatos', [])
        for i, fato in enumerate(fatos_atuais):
            novo_fato = input(f"Fato {i + 1} [{fato}]: ").strip()
            if novo_fato:
                fatos_atuais[i] = novo_fato
        
        novo_fato = input(f"Novo fato (opcional): ").strip()
        if novo_fato:
            fatos_atuais.append(novo_fato)
        
        curiosidade['fatos'] = fatos_atuais
        curiosidade['dataAdicao'] = datetime.now().strftime("%Y-%m-%d")
        
        self.salvar()
        print(f"\n✅ Curiosidade atualizada com sucesso!")
    
    def deletar_curiosidade(self):
        """Deletar curiosidade"""
        self.listar_curiosidades()
        
        curiosidades = self.dados.get('curiosidades', [])
        if not curiosidades:
            return
        
        print("\n" + "=" * 80)
        print("🗑️ DELETAR CURIOSIDADE")
        print("=" * 80 + "\n")
        
        try:
            indice = int(input("Número da curiosidade a deletar: ")) - 1
            if indice < 0 or indice >= len(curiosidades):
                print("❌ Opção inválida")
                return
        except ValueError:
            print("❌ Digite um número válido")
            return
        
        empresa = curiosidades[indice].get('empresa')
        confirmacao = input(f"\n⚠️  Tem certeza que quer deletar '{empresa}'? (s/n): ").lower().strip()
        
        if confirmacao == 's':
            del curiosidades[indice]
            self.salvar()
            print(f"✅ Curiosidade '{empresa}' deletada!")
        else:
            print("❌ Operação cancelada")
    
    def visualizar_curiosidade(self):
        """Visualizar curiosidade em detalhe"""
        self.listar_curiosidades()
        
        curiosidades = self.dados.get('curiosidades', [])
        if not curiosidades:
            return
        
        try:
            indice = int(input("\nNúmero da curiosidade: ")) - 1
            if indice < 0 or indice >= len(curiosidades):
                print("❌ Opção inválida")
                return
        except ValueError:
            print("❌ Digite um número válido")
            return
        
        c = curiosidades[indice]
        
        print("\n" + "=" * 80)
        print(f"📖 {c.get('titulo')}")
        print("=" * 80 + "\n")
        
        print(f"🏢 Empresa: {c.get('empresa')}")
        print(f"📍 Símbolo: {c.get('simbolo')}")
        print(f"📊 Posição: {c.get('posicao')}")
        print(f"📈 Setor: {c.get('setor')}")
        print(f"💰 Market Cap: {c.get('marketCap')}")
        print(f"📉 Div. Yield: {c.get('dividendYield')}")
        print(f"🔗 Link: {c.get('link')}")
        print(f"📅 Adicionada em: {c.get('dataAdicao')}\n")
        
        print(f"📝 Descrição:\n{c.get('descricao')}\n")
        
        print("📌 Fatos Principais:")
        for i, fato in enumerate(c.get('fatos', []), 1):
            print(f"   {i}. {fato}")
        
        print(f"\n💡 Insight:\n{c.get('insight')}\n")
    
    def gerar_template_rapido(self):
        """Gerar template JSON para edição rápida"""
        print("\n" + "=" * 80)
        print("📋 TEMPLATE PARA EDIÇÃO RÁPIDA")
        print("=" * 80 + "\n")
        
        template = {
            "id": len(self.dados.get('curiosidades', [])) + 1,
            "posicao": "Nº",
            "simbolo": "XXXX",
            "empresa": "Nome da Empresa",
            "setor": "Nome do Setor",
            "dataAdicao": datetime.now().strftime("%Y-%m-%d"),
            "titulo": "Título da Curiosidade",
            "descricao": "Descrição detalhada da empresa...",
            "fatos": [
                "Fato 1",
                "Fato 2",
                "Fato 3",
                "Fato 4",
                "Fato 5"
            ],
            "dividendYield": "X.XX%",
            "marketCap": "$XB",
            "insight": "Insight para investidores...",
            "link": "https://www.empresa.com",
            "imagem": "https://via.placeholder.com/400x300?text=Empresa"
        }
        
        print(json.dumps(template, ensure_ascii=False, indent=2))
        print("\n✅ Template gerado acima. Copie para editar em um editor JSON!")
    
    def menu_principal(self):
        """Menu principal"""
        while True:
            print("\n" + "=" * 80)
            print("🌟 GERENCIADOR DE CURIOSIDADES - SP500 DASHBOARD")
            print("=" * 80 + "\n")
            print("1. 📚 Listar Curiosidades")
            print("2. ➕ Adicionar Nova Curiosidade")
            print("3. ✏️  Editar Curiosidade")
            print("4. 🗑️  Deletar Curiosidade")
            print("5. 📖 Visualizar Curiosidade Completa")
            print("6. 📋 Gerar Template para Edição Rápida")
            print("7. 📤 Exportar para CSV")
            print("8. 📊 Estatísticas")
            print("9. 🚪 Sair")
            print("\n" + "=" * 80 + "\n")
            
            opcao = input("Escolha uma opção (1-9): ").strip()
            
            if opcao == '1':
                self.listar_curiosidades()
            elif opcao == '2':
                self.adicionar_curiosidade()
            elif opcao == '3':
                self.editar_curiosidade()
            elif opcao == '4':
                self.deletar_curiosidade()
            elif opcao == '5':
                self.visualizar_curiosidade()
            elif opcao == '6':
                self.gerar_template_rapido()
            elif opcao == '7':
                self.exportar_csv()
            elif opcao == '8':
                self.mostrar_estatisticas()
            elif opcao == '9':
                print("\n✅ Até logo!")
                break
            else:
                print("❌ Opção inválida")
            
            input("\n📌 Pressione Enter para continuar...")
    
    def exportar_csv(self):
        """Exportar curiosidades para CSV"""
        try:
            import csv
            
            curiosidades = self.dados.get('curiosidades', [])
            if not curiosidades:
                print("📭 Nenhuma curiosidade para exportar")
                return
            
            nome_arquivo = f"curiosidades_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
            
            with open(nome_arquivo, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=curiosidades[0].keys())
                writer.writeheader()
                for c in curiosidades:
                    # Converter lista de fatos em string
                    c_copy = c.copy()
                    c_copy['fatos'] = '; '.join(c_copy.get('fatos', []))
                    writer.writerow(c_copy)
            
            print(f"✅ Exportado para: {nome_arquivo}")
        except Exception as e:
            print(f"❌ Erro ao exportar: {e}")
    
    def mostrar_estatisticas(self):
        """Mostrar estatísticas"""
        curiosidades = self.dados.get('curiosidades', [])
        
        print("\n" + "=" * 80)
        print("📊 ESTATÍSTICAS")
        print("=" * 80 + "\n")
        
        print(f"Total de Curiosidades: {len(curiosidades)}")
        
        if curiosidades:
            setores = set(c.get('setor') for c in curiosidades)
            print(f"Total de Setores Únicos: {len(setores)}")
            
            fatos_totais = sum(len(c.get('fatos', [])) for c in curiosidades)
            print(f"Total de Fatos: {fatos_totais}")
            
            # Empresas com maior e menor dividend yield
            div_yields = [(c.get('empresa'), float(c.get('dividendYield', '0%').rstrip('%'))) 
                         for c in curiosidades if c.get('dividendYield', '0%') != '0.00%']
            
            if div_yields:
                maior = max(div_yields, key=lambda x: x[1])
                menor = min(div_yields, key=lambda x: x[1])
                print(f"\n💰 Maior Div. Yield: {maior[0]} ({maior[1]}%)")
                print(f"💰 Menor Div. Yield: {menor[0]} ({menor[1]}%)")
        
        print()


def main():
    """Função principal"""
    print("\n" + "=" * 80)
    print("🚀 GERENCIADOR DE CURIOSIDADES DO SP500 DASHBOARD")
    print("=" * 80 + "\n")
    
    # Procurar arquivo
    arquivo = "curiosidades.json"
    
    if not Path(arquivo).exists():
        print(f"⚠️  Arquivo '{arquivo}' não encontrado no diretório atual.")
        caminho = input(f"Digite o caminho completo do arquivo ou Enter para '{arquivo}': ").strip()
        if caminho:
            arquivo = caminho
    
    gerenciador = GerenciadorCuriosidades(arquivo)
    gerenciador.menu_principal()


if __name__ == "__main__":
    main()
