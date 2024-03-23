export interface Turma {
  turmaId: string
  cursoTitulo: string
  unidadeNome: string
  turmaDias: string
  turmaClassificacao: TurmaClassificacao
  turmaTags: TurmaTag[]
  vagasDisponiveis: number
  vagasALiberar: number
  permitirApenasCredenciados: boolean
  finalizarFila: boolean
}

export interface TurmaClassificacao {
  classificacao: string
  classificacaoTooltip: string
  classificacaoCorDoTexto: string
  classificacaoCorDoFundo: string
}

export interface TurmaTag {
  descricao: string
  tooltip: string
  ordem: number
  corDoTexto: string
  corDoFundo: string
}